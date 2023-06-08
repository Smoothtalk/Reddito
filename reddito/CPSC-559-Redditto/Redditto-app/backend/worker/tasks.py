from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, func
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from celery import Celery
import os

DB0_USER = os.environ["DB0_USER"]
DB0_PASSWORD = os.environ["DB0_PASSWORD"]
DB0_HOST = os.environ["DB0_HOST"]
DB0 = os.environ["DB0"]

DB1_USER = os.environ["DB1_USER"]
DB1_PASSWORD = os.environ["DB1_PASSWORD"]
DB1_HOST = os.environ["DB1_HOST"]
DB1 = os.environ["DB1"]

DB2_USER = os.environ["DB2_USER"]
DB2_PASSWORD = os.environ["DB2_PASSWORD"]
DB2_HOST = os.environ["DB2_HOST"]
DB2 = os.environ["DB2"]

RABBITMQ_USER = os.environ["RABBITMQ_USER"]
RABBITMQ_PASSWORD = os.environ["RABBITMQ_PASSWORD"]
RABBITMQ_HOST = os.environ["RABBITMQ_HOST"]
RABBITMQ_PORT = os.environ["RABBITMQ_PORT"]

db0_engine = create_engine('postgresql://' + DB0_USER + ':' + DB0_PASSWORD + '@' + DB0_HOST + '/' + DB0)
db1_engine = create_engine('postgresql://' + DB1_USER + ':' + DB1_PASSWORD + '@' + DB1_HOST + '/' + DB1)
db2_engine = create_engine('postgresql://' + DB2_USER + ':' + DB2_PASSWORD + '@' + DB2_HOST + '/' + DB2)

DB0Session = sessionmaker(bind=db0_engine)
DB1Session = sessionmaker(bind=db1_engine)
DB2Session = sessionmaker(bind=db2_engine)

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    username = Column(String(100), primary_key=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    major = Column(String(100), nullable=False)
    password = Column(String(100), nullable=False)
    time_created = Column(DateTime, server_default=func.now())

class Post(Base):
    __tablename__ = 'post'
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    likes = Column(Integer, nullable=False)
    dislikes = Column(Integer, nullable=False)
    username = Column(String(100), primary_key=False)
    major = Column(String(100), nullable=False)
    time_created = Column(DateTime, server_default=func.now())

class Comment(Base):
    __tablename__ = 'comment'
    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    username = Column(String(100), nullable=False)
    postId = Column(Integer, nullable=False)
    time_created = Column(DateTime, server_default=func.now())

app = Celery('tasks', broker='amqp://' + RABBITMQ_USER + ':' + RABBITMQ_PASSWORD + '@' + RABBITMQ_HOST + ':' + RABBITMQ_PORT, backend='rpc://' + RABBITMQ_USER + ':' + RABBITMQ_PASSWORD + '@' + RABBITMQ_HOST + ':' + RABBITMQ_PORT)

@app.task
def commit_user(username, first_name, last_name, major, password):
    user0 = User(username=username, first_name=first_name, last_name=last_name, major=major, password=password)
    user1 = User(username=username, first_name=first_name, last_name=last_name, major=major, password=password)
    user2 = User(username=username, first_name=first_name, last_name=last_name, major=major, password=password)
    user = None

    with DB0Session() as db0_session:
        try:
            db0_session.add(user0)
            db0_session.commit()
            user = {'username': user0.username, 'first_name': user0.first_name, 'last_name': user0.last_name, 'major': user0.major, 'time_created': user0.time_created}
        except:
            print('db-0: Failed to commit comment')
        finally:
            db0_session.close()

    with DB1Session() as db1_session:
        try:
            db1_session.add(user1)
            db1_session.commit()
            user = {'username': user1.username, 'first_name': user1.first_name, 'last_name': user1.last_name, 'major': user1.major, 'time_created': user1.time_created}
        except:
            print('db-1: Failed to commit comment')
        finally:
            db1_session.close()

    with DB2Session() as db2_session:
        try:
            db2_session.add(user2)
            db2_session.commit()
            user = {'username': user2.username, 'first_name': user2.first_name, 'last_name': user2.last_name, 'major': user2.major, 'time_created': user2.time_created}
        except:
            print('db-2: Failed to commit comment')
        finally:
            db2_session.close()

    return user

@app.task
def commit_post(title, content, likes, dislikes, username, major):
    post0 = Post(title=title, content=content, likes=likes, dislikes=dislikes, username=username, major=major)
    post1 = Post(title=title, content=content, likes=likes, dislikes=dislikes, username=username, major=major)
    post2 = Post(title=title, content=content, likes=likes, dislikes=dislikes, username=username, major=major)
    post = None

    with DB0Session() as db0_session:
        try:
            db0_session.add(post0)
            db0_session.commit()
            post = {'id': post0.id, 'title': post0.title, 'content': post0.content, 'likes': post0.likes, 'dislikes': post0.dislikes, 'username': post0.username, 'major': post0.major, 'time_created': post0.time_created}
        except:
            print('db-0: Failed to commit post')
        finally:
            db0_session.close()

    with DB1Session() as db1_session:
        try:
            db1_session.add(post1)
            db1_session.commit()
            post = {'id': post1.id, 'title': post1.title, 'content': post1.content, 'likes': post1.likes, 'dislikes': post1.dislikes, 'username': post1.username, 'major': post1.major, 'time_created': post1.time_created}
        except:
            print('db-1: Failed to commit post')
        finally:
            db1_session.close()

    with DB2Session() as db2_session:
        try:
            db2_session.add(post2)
            db2_session.commit()
            post = post = {'id': post2.id, 'title': post2.title, 'content': post2.content, 'likes': post2.likes, 'dislikes': post2.dislikes, 'username': post2.username, 'major': post2.major, 'time_created': post2.time_created}
        except:
            print('db-2: Failed to commit post')
        finally:
            db2_session.close()

    return post

@app.task
def commit_comment(content, username, postId):
    comment0 = Comment(content=content, username=username, postId=postId)
    comment1 = Comment(content=content, username=username, postId=postId)
    comment2 = Comment(content=content, username=username, postId=postId)
    comment = None

    with DB0Session() as db0_session:
        try:
            db0_session.add(comment0)
            db0_session.commit()
            comment = {'id': comment0.id, 'content': comment0.content, 'username': comment0.username, 'postId': comment0.postId, 'time_created': comment0.time_created}
        except:
            print('db-0: Failed to commit comment')
        finally:
            db0_session.close()

    with DB1Session() as db1_session:
        try:
            db1_session.add(comment1)
            db1_session.commit()
            comment = {'id': comment1.id, 'content': comment1.content, 'username': comment1.username, 'postId': comment1.postId, 'time_created': comment1.time_created}
        except:
            print('db-1: Failed to commit comment')
        finally:
            db1_session.close()

    with DB2Session() as db2_session:
        try:
            db2_session.add(comment2)
            db2_session.commit()
            comment = {'id': comment2.id, 'content': comment2.content, 'username': comment2.username, 'postId': comment2.postId, 'time_created': comment2.time_created}
        except:
            print('db-2: Failed to commit comment')
        finally:
            db2_session.close()

    return comment
