import datetime

import numpy as np
import pandas as pd
import io
import json

from gensim.models import KeyedVectors
from keras.preprocessing.text import Tokenizer, text_to_word_sequence
from keras.utils import plot_model
from keras_preprocessing.sequence import pad_sequences
from keras.utils.np_utils import to_categorical
from keras.layers import Input, Dense, Conv2D, MaxPooling2D, Dropout, concatenate, Embedding
from keras.layers.core import Reshape, Flatten
from keras.callbacks import EarlyStopping, ModelCheckpoint
from keras.models import Model
from keras import regularizers
from pyvi import ViUtils, ViTokenizer
from sklearn.model_selection import train_test_split

DATA_TRAIN_PATH = 'datasource/model-v3/Corpus_Sentiment.xlsx'
MODEL_JSON_PATH = 'model-v3/CNN_emotion_model_full.json'
VOCAB_JSON_PATH = 'model-v3/vocab.json'
URL_WORD2VEC_MODEL = 'model-v3/Full_Data_for_Word2Vec.model'
dot_img_file = 'AI-SentimentAnalyze/model_visualize.png'

EMBEDDING_DIM = 300
NUM_WORDS = 50000
MAX_LENGTH = 300
PADDING_TYPE = ['post', 'pre']
FILTER_SIZES = [3, 4, 5]
NUM_FILTERS = 298
DROP = 0.2
EPOCH = 20
BATCH_SIZE = 128
L2 = 0.0004


def data_processed():
    train_data = pd.read_excel(DATA_TRAIN_PATH)

    input_data = train_data['comment'].values
    input_label = train_data['tag'].values

    labels = {'buồn': 0, 'bình thường': 1, 'vui': 2}

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

    label_idx = [labels[i] for i in label_with_accent]
    label_tf = to_categorical(label_idx, num_classes=3, dtype='float32')

    tokenizer = Tokenizer(num_words=NUM_WORDS, filters='!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n\'',
                          lower=True)
    tokenizer.fit_on_texts(input_pre)
    tokenizer_json = tokenizer.to_json()
    with io.open(VOCAB_JSON_PATH, 'w', encoding='utf-8') as f:
        f.write(json.dumps(tokenizer_json, ensure_ascii=False))

    print("tokenizer Text:")
    print(input_pre)

    tokenized_data_text = tokenizer.texts_to_sequences(input_pre)
    vec_data = pad_sequences(tokenized_data_text, padding='post', maxlen=MAX_LENGTH)
    print("input data.shape ", vec_data.shape)
    vocabulary_size = min(len(tokenizer.word_index) + 1, NUM_WORDS)
    print("vocabulary_size size: ", vocabulary_size)

    X_train, X_val, y_train, y_val = train_test_split(vec_data, label_tf, test_size=0.2, random_state=42)
    X_train, X_test, y_train, y_test = train_test_split(X_train, y_train, test_size=0.1, random_state=42)
    print("training sample: ", len(X_train))
    print("validation sample: ", len(X_val))
    print("test sample: ", len(X_test))
    word_index = tokenizer.word_index
    print('Found %s unique tokens.' % len(word_index))

    word_vectors = KeyedVectors.load(URL_WORD2VEC_MODEL, mmap='r')

    embedding_matrix = np.zeros((vocabulary_size, EMBEDDING_DIM))
    print("embedding_matrix size:", embedding_matrix.size)
    for word, i in word_index.items():
        if i >= NUM_WORDS:
            continue
        try:
            embedding_vector = word_vectors[word]
            embedding_matrix[i] = embedding_vector
        except KeyError:
            embedding_matrix[i] = np.random.normal(0, np.sqrt(0.25), EMBEDDING_DIM)

    del word_vectors

    embedding_layer = Embedding(vocabulary_size,
                                EMBEDDING_DIM,
                                weights=[embedding_matrix],
                                trainable=True)

    return X_train, y_train, X_test, y_test, X_val, y_val, embedding_layer


print(datetime.datetime.now())
t1 = datetime.datetime.now()

X_train, y_train, X_test, y_test, X_val, y_val, embedding_layer = data_processed()

sequence_length = X_train.shape[1]
inputs = Input(shape=(sequence_length,))
embedding = embedding_layer(inputs)
reshape = Reshape((sequence_length, EMBEDDING_DIM, 1))(embedding)

conv_0 = Conv2D(NUM_FILTERS, (FILTER_SIZES[0], EMBEDDING_DIM), activation='sigmoid',
                kernel_regularizer=regularizers.l2(L2))(reshape)
conv_1 = Conv2D(NUM_FILTERS, (FILTER_SIZES[1], EMBEDDING_DIM), activation='sigmoid',
                kernel_regularizer=regularizers.l2(L2))(reshape)
conv_2 = Conv2D(NUM_FILTERS, (FILTER_SIZES[2], EMBEDDING_DIM), activation='sigmoid',
                kernel_regularizer=regularizers.l2(L2))(reshape)
conv_3 = Conv2D(NUM_FILTERS, (FILTER_SIZES[2], EMBEDDING_DIM), activation='sigmoid',
                kernel_regularizer=regularizers.l2(L2))(reshape)
conv_4 = Conv2D(NUM_FILTERS, (FILTER_SIZES[2], EMBEDDING_DIM), activation='sigmoid',
                kernel_regularizer=regularizers.l2(L2))(reshape)

maxpool_0 = MaxPooling2D((sequence_length - FILTER_SIZES[0] + 1, 1), strides=(1,1))(conv_0)
maxpool_1 = MaxPooling2D((sequence_length - FILTER_SIZES[1] + 1, 1), strides=(1,1))(conv_1)
maxpool_2 = MaxPooling2D((sequence_length - FILTER_SIZES[2] + 1, 1), strides=(1,1))(conv_2)
maxpool_3 = MaxPooling2D((sequence_length - FILTER_SIZES[2] + 1, 1), strides=(1,1))(conv_3)
maxpool_4 = MaxPooling2D((sequence_length - FILTER_SIZES[2] + 1, 1), strides=(1,1))(conv_4)

merged_tensor = concatenate([maxpool_0, maxpool_1, maxpool_2, maxpool_3, maxpool_4], axis=1)
flatten = Flatten()(merged_tensor)
reshape = Reshape((5*NUM_FILTERS,))(flatten)
dropout = Dropout(DROP)(flatten)
output = Dense(units=3, activation='softmax', kernel_regularizer=regularizers.l2(L2))(dropout)

# this creates a model that includes
model = Model(inputs, output)
# adam = Adam(lr=1e-3)

model.summary()
model.compile(loss='mse',
              optimizer='adam',
              metrics=['acc'])
callbacks = [EarlyStopping(monitor='val_loss')]

# plot_model(model, to_file=dot_img_file, show_shapes=True)

checkpoint_filepath = 'model-v3/CNN_emotion_doc_raw_train_2c-{epoch:03d}-{val_loss:.4f}-{val_acc:.4f}.h5'
model_checkpoint_callback = ModelCheckpoint(
    filepath=checkpoint_filepath,
    save_weights_only=True,
    monitor='val_acc',
    mode='max',
    save_best_only=True)  # validation
model.fit(X_train, y_train, batch_size=BATCH_SIZE, epochs=EPOCH, verbose=1,
          validation_data=(X_val, y_val),
          callbacks=[model_checkpoint_callback])  # starts training

model_json = model.to_json()

with open(MODEL_JSON_PATH, 'w') as json_file:
    json_file.write(model_json)

scores = model.evaluate(X_test, y_test)
print("Loss:", (scores[0]))
print("Accuracy:", (scores[1]*100))

t2 = datetime.datetime.now()
print(t2)
print("Time: ", t2-t1)
