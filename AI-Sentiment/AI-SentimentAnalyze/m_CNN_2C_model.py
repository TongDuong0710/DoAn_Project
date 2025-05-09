import datetime
import numpy as np

from keras.layers import Input, Dense, Conv2D, MaxPooling2D, Dropout, concatenate
from keras.layers.core import Reshape, Flatten
from keras.callbacks import EarlyStopping
# from keras.optimizers import Adam
from keras.models import Model
from keras import regularizers
from keras.callbacks import ModelCheckpoint
from matplotlib import pyplot as plt

# thiet lap chung
from data_processed2 import load_data_temp

print(datetime.datetime.now())
t1 = datetime.datetime.now()

model_json_full = "model/CNN_emotion_model_full.json"

EMBEDDING_DIM = 300
filter_sizes = [3, 4, 5]
num_filters = 298
drop = 0.2
epoch = 20
batch_size = 128
train_len = 0
L2 = 0.0004
np.random.seed(0)

X_train, y_train, X_test, y_test, X_val, y_val, embedding_layer = load_data_temp()

sequence_length = X_train.shape[1]
inputs = Input(shape=(sequence_length,))
embedding = embedding_layer(inputs)
reshape = Reshape((sequence_length, EMBEDDING_DIM, 1))(embedding)

conv_0 = Conv2D(num_filters, (filter_sizes[0], EMBEDDING_DIM), activation='sigmoid',
                kernel_regularizer=regularizers.l2(L2))(reshape)
conv_1 = Conv2D(num_filters, (filter_sizes[1], EMBEDDING_DIM), activation='sigmoid',
                kernel_regularizer=regularizers.l2(L2))(reshape)
conv_2 = Conv2D(num_filters, (filter_sizes[2], EMBEDDING_DIM), activation='sigmoid',
                kernel_regularizer=regularizers.l2(L2))(reshape)
conv_3 = Conv2D(num_filters, (filter_sizes[2], EMBEDDING_DIM), activation='sigmoid',
                kernel_regularizer=regularizers.l2(L2))(reshape)
conv_4 = Conv2D(num_filters, (filter_sizes[2], EMBEDDING_DIM), activation='sigmoid',
                kernel_regularizer=regularizers.l2(L2))(reshape)

maxpool_0 = MaxPooling2D((sequence_length - filter_sizes[0] + 1, 1), strides=(1,1))(conv_0)
maxpool_1 = MaxPooling2D((sequence_length - filter_sizes[1] + 1, 1), strides=(1,1))(conv_1)
maxpool_2 = MaxPooling2D((sequence_length - filter_sizes[2] + 1, 1), strides=(1,1))(conv_2)
maxpool_3 = MaxPooling2D((sequence_length - filter_sizes[2] + 1, 1), strides=(1,1))(conv_3)
maxpool_4 = MaxPooling2D((sequence_length - filter_sizes[2] + 1, 1), strides=(1,1))(conv_4)

merged_tensor = concatenate([maxpool_0, maxpool_1, maxpool_2, maxpool_3, maxpool_4], axis=1)
flatten = Flatten()(merged_tensor)
reshape = Reshape((5*num_filters,))(flatten)
dropout = Dropout(drop)(flatten)
output = Dense(units=3, activation='softmax', kernel_regularizer=regularizers.l2(L2))(dropout)

# this creates a model that includes
model = Model(inputs, output)
# adam = Adam(lr=1e-3)

model.summary()

# can replace categorical_crossentropy to mse : mean_squared_error
# metrics = measure
model.compile(loss='mse',
              optimizer='adam',
              metrics=['acc'])
callbacks = [EarlyStopping(monitor='val_loss')]
#Stop training when a monitored metric has stopped improving.


print("train_len:")
print(train_len)

checkpoint_filepath = 'model/CNN_emotion_doc_raw_train_2c-{epoch:03d}-{val_loss:.4f}-{val_acc:.4f}.h5'
model_checkpoint_callback = ModelCheckpoint(
    filepath=checkpoint_filepath,
    save_weights_only=True,
    monitor='val_acc',
    mode='max',
    save_best_only=True)  # validation
#batchsize : fit train data size
history = model.fit(X_train, y_train, batch_size=batch_size, epochs=epoch, verbose=1,
          validation_data=(X_val, y_val),
          callbacks=[model_checkpoint_callback])  # starts training

model_json = model.to_json()

with open(model_json_full, 'w') as json_file:
    json_file.write(model_json)

plt.plot(history.history['acc'])
plt.plot(history.history['val_acc'])
plt.title('model accuracy')
plt.ylabel('accuracy')
plt.xlabel('epoch')
plt.legend(['train', 'val'], loc='upper left')
plt.savefig('result/graph/accuracy_graph.png')
plt.show()


plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('model loss')
plt.ylabel('loss')
plt.xlabel('epoch')
plt.legend(['train', 'val'], loc='upper left')
plt.savefig('result/graph/loss_graph.png')
plt.show()



# model.save_weights(model_h5_file)

scores = model.evaluate(X_test, y_test)
print("Loss:", (scores[0]))
print("Accuracy:", (scores[1]*100))

print(datetime.datetime.now())
t2 = datetime.datetime.now()
print("Time:")
print(t2-t1)
