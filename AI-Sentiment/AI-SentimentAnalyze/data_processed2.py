import io
import json

import numpy as np
import pandas as pd
import re
from keras.preprocessing.text import Tokenizer, text_to_word_sequence
# from keras.utils import pad_sequences
from keras.utils import pad_sequences
from keras.utils.np_utils import to_categorical
from gensim.models.keyedvectors import KeyedVectors
from pyvi import ViUtils, ViTokenizer
from sklearn.model_selection import train_test_split

Data_Full_train_2C = "datasource/model/Corpus_Sentiment.xlsx"
url_word2vec_aspect = "model/Full_Data_for_Word2vec.model"

EMBEDDING_DIM = 300
NUM_WORDS = 50000
max_length = 300
pad = ['post', 'pre']
test_num_full = 400


def clean_str(string):
    string = re.sub(r"[^A-Za-z0-9(),!?\'\`]", " ", string)
    string = re.sub(r"\'s", " \'s", string)
    string = re.sub(r"\'ve", " \'ve", string)
    string = re.sub(r"n\'t", " n\'t", string)
    string = re.sub(r"\'re", " \'re", string)
    string = re.sub(r"\'d", " \'d", string)
    string = re.sub(r"\'ll", " \'ll", string)
    string = re.sub(r",", " , ", string)
    string = re.sub(r"!", " ! ", string)
    string = re.sub(r"\(", " \( ", string)
    string = re.sub(r"\)", " \) ", string)
    string = re.sub(r"\?", " \? ", string)
    string = re.sub(r"\s{2,}", " ", string)
    return string.strip().lower()


def tokenize(train_data):
    input_data = train_data['comment'].values
    input_label = train_data['tag'].values

    input_pre = []
    label_with_accent = []
    for idx, dt in enumerate(input_data):
        input_text_pre = list(text_to_word_sequence(dt))
        input_text_pre = " ".join(input_text_pre)
        input_text_pre_no_accent = str(ViUtils.remove_accents(input_text_pre).decode("utf-8"))
        input_text_pre_accent = ViTokenizer.tokenize(input_text_pre)
        input_text_pre_no_accent = ViTokenizer.tokenize(input_text_pre_no_accent)
        input_pre.append(input_text_pre_accent)
        input_pre.append(input_text_pre_no_accent)
        label_with_accent.append(input_label[idx])
        label_with_accent.append(input_label[idx])

    return input_pre, label_with_accent


def load_data_temp():
    train_data = pd.read_excel(Data_Full_train_2C)
    train_len = len(train_data)
    print(train_len)

    print(train_data.isnull().sum())

    dic = {'yêu đời': 0, 'bình thường': 1, 'thất tình': 2}
    # labels = train_data.tag.apply(lambda x: dic[x])

    input_data = train_data['comment'].values
    input_label = train_data['tag'].values

    labels = [dic[i] for i in input_label]
    labels = to_categorical(labels, num_classes=3, dtype='float32')

    tokenizer = Tokenizer(num_words=NUM_WORDS, filters='!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n\'',
                          lower=True)
    tokenizer.fit_on_texts(input_data)
    tokenizer_json = tokenizer.to_json()
    with io.open('model/vocab.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(tokenizer_json, ensure_ascii=False))
    print("tokenizer Text:")
    print(input_data)

    tokenized_data_text = tokenizer.texts_to_sequences(input_data)
    vec_data = pad_sequences(tokenized_data_text, padding='post', maxlen=max_length)
    print("input data.shape ", vec_data.shape)

    X_train, X_val, y_train, y_val = train_test_split(vec_data, labels, test_size=0.2, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(X_train, y_train, test_size=0.1, random_state=42)
    print("training sample: ", len(X_train))
    print("validation sample: ", len(X_val))
    print("test sample: ", len(X_test))
    word_index = tokenizer.word_index
    print('Found %s unique tokens.' % len(word_index))

    word_vectors = KeyedVectors.load(url_word2vec_aspect, mmap='r')

    vocabulary_size = min(len(word_index) + 1, NUM_WORDS)
    print("vocabulary_size size:")
    print(vocabulary_size)
    embedding_matrix = np.zeros((vocabulary_size, EMBEDDING_DIM))
    print("embedding_matrix size:")
    print(embedding_matrix)
    for word, i in word_index.items():
        if i >= NUM_WORDS:
            continue
        try:
            embedding_vector = word_vectors[word]
            embedding_matrix[i] = embedding_vector
        except KeyError:
            embedding_matrix[i] = np.random.normal(0, np.sqrt(0.25), EMBEDDING_DIM)

    del (word_vectors)

    from keras.layers import Embedding
    embedding_layer = Embedding(vocabulary_size,
                                EMBEDDING_DIM,
                                weights=[embedding_matrix],
                                trainable=True)
    print("embedding_layer")

    return X_train, y_train, X_test, y_test, X_val, y_val, embedding_layer


