import gzip
import gensim
import logging
import os

logging.basicConfig(
    format='%(asctime)s : %(levelname)s : %(message)s',
    level=logging.INFO)


def show_file_contents(input_file):
    with gzip.open(input_file, 'rb') as f:
        for i, line in enumerate(f):
            print(line)
            break


def read_input(input_file):
    """gzip format"""

    logging.info("Đọc file {0} ... ".format(input_file))
    with gzip.open(input_file, 'rb') as f:
        for i, line in enumerate(f):
            if (i % 10 == 0):
                logging.info("đọc {0} ý kiến".format(i))
            # do some pre-processing and return list of words for each review
            # text
            yield gensim.utils.simple_preprocess(line)


if __name__ == '__main__':

    abspath = os.path.dirname(os.path.abspath(__file__))
    # data_file = os.path.join(abspath, "..\\Car_Reviews.txt.gz")
    # data_file = os.path.join("C:\\Users\\Study\\Desktop\\Dataset_new\\Test_tot\\chua_chuan_hoa\\lan_1\\phrases.gz")
    data_file = os.path.join("datasource/model/Corpus_Sentiment.txt.gz")
    # read the tokenized reviews into a list
    # each review item becomes a serries of words
    # so this becomes a list of lists
    documents = list(read_input(data_file))
    logging.info("Đọc xong file dữ liệu")
    # print(documents)
    # build vocabulary and train model
    model = gensim.models.Word2Vec(
        documents,
        vector_size=300,
        window=5,# left right - consider
        min_count=2,
        workers=10, # size of thread parallel
        alpha=0.1,
        sg=0, # CBOW
        cbow_mean=0)  # 0, use the sum of the context word vectors
    model.train(documents, total_examples=len(documents), epochs=50)
    # model.wv.save(os.path.join("C:\\Users\\Study\\Desktop\\Dataset_new\\Test_tot\\chua_chuan_hoa\\lan_1\\tot_test_phrase_size_300.model"))
    # model.wv.save(os.path.join("C:\\Users\\Study\\Desktop\\Dataset_new\\tot_test_phrase_size_300.model"))
    model.wv.save(os.path.join("model/Full_Data_for_Word2vec.model"))
    # model.wv.save(os.path.join(abspath, "..\\Temp_w1000.model"))
    # model.wv.save_word2vec_format(os.path.join(abspath, "..\\Car_Full_Reviews_190.model"))
    # model.wv.save_word2vec_format(os.path.join(abspath, "..\\Car_Full_Reviews_190.txt"))

    w1 = ["buồn"]
    print("Tương tự nhất với {0}:".format(w1), model.wv.most_similar(negative=w1))
