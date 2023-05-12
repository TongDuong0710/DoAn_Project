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

Data_Full_train_2C = "datasource/model-v3/Corpus_Sentiment.xlsx"
url_word2vec_aspect = "model-v3/Full_Data_for_Word2vec.model"

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
    # test_data = pd.read_excel(Data_Full_train_2C, 'Sheet1')
    train_data = pd.read_excel(Data_Full_train_2C)
    train_len = len(train_data)

    print(train_data.isnull().sum())

    dic = {'yêu đời': 0, 'bình thường': 1, 'thất tình': 2}
    labels = train_data.tag.apply(lambda x: dic[x])

    # val_data = train_data.sample(frac=0.17, random_state=42)  # cross validation: 1/10
    test_data = train_data[515:714]
    train_data = train_data.drop(test_data.index)
    val_data = train_data[315:514]
    train_data = train_data.drop(val_data.index)
    texts = train_data.comment

    print("training sample: ", len(texts))
    print("validation sample: ", len(val_data))
    print("test sample: ", len(test_data))
    '''
    print("texts")
    print(len(texts))
    print("len train_data")
    print(len(train_data))
    print("train_data 7000:")
    print(train_data.text[7000])
    print("val_data 0:")
    print(val_data.text[val_data_raw_from])
    '''
    tokenizer = Tokenizer(num_words=NUM_WORDS, filters='!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n\'',
                          lower=True)
    tokenizer.fit_on_texts(texts)
    tokenizer_json = tokenizer.to_json()
    with io.open('model-v3/vocab.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(tokenizer_json, ensure_ascii=False))
    print("tokenizer Text:")
    print(texts)
    sequences_train = tokenizer.texts_to_sequences(texts)
    sequences_valid = tokenizer.texts_to_sequences(val_data.comment)
    sequences_test = tokenizer.texts_to_sequences(test_data.comment)
    word_index = tokenizer.word_index
    print('Found %s unique tokens.' % len(word_index))
    '''
    print("Cau thu train_data")
    print(sequences_train[train_len - test_num_full + 1])
    '''
    X_train = pad_sequences(sequences_train, maxlen=max_length, padding=pad[0])
    X_val = pad_sequences(sequences_valid, maxlen=X_train.shape[1], padding=pad[0])
    X_test = pad_sequences(sequences_test, maxlen=X_train.shape[1], padding=pad[0])
    y_train = to_categorical(np.asarray(labels[train_data.index]))
    y_val = to_categorical(np.asarray(labels[val_data.index]))
    y_test = to_categorical(np.asarray(labels[test_data.index]))

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
#    print(embedding_layer.weights())
    vocabulary_size = min(len(word_index) + 1, NUM_WORDS)
    '''
    X_test = X_train[train_len - test_num_full:]
    y_test = y_train[train_len - test_num_full:]
    X_train = X_train[0: train_len - test_num_full]
    y_train = y_train[0: train_len - test_num_full]
    '''
    return X_train, y_train, X_test, y_test, X_val, y_val, embedding_layer


