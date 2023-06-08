from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from celery import Celery
from celery.result import AsyncResult
import os

CREATE_TABLE = os.environ["CREATE_TABLE"]

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

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_BINDS'] = {
    'db-0': 'postgresql://' + DB0_USER + ':' + DB0_PASSWORD + '@' + DB0_HOST + '/' + DB0,
    'db-1': 'postgresql://' + DB1_USER + ':' + DB1_PASSWORD + '@' + DB1_HOST + '/' + DB1,
    'db-2': 'postgresql://' + DB2_USER + ':' + DB2_PASSWORD + '@' + DB2_HOST + '/' + DB2,
}
# app.config['SQLALCHEMY_POOL_TIMEOUT'] = {
#     'db-0': 1,
#     'db-1': 1,
#     'db-2': 1,
# }

CORS(app)
db = SQLAlchemy(app)
worker = Celery('worker', broker='amqp://' + RABBITMQ_USER + ':' + RABBITMQ_PASSWORD + '@' + RABBITMQ_HOST + ':' + RABBITMQ_PORT, backend='rpc://' + RABBITMQ_USER + ':' + RABBITMQ_PASSWORD + '@' + RABBITMQ_HOST + ':' + RABBITMQ_PORT)

class UserDB0(db.Model):
    __bind_key__ = 'db-0'
    __tablename__ = 'user'
    username = db.Column(db.String(100), primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    major = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    time_created = db.Column(db.DateTime, server_default=db.func.now())

class PostDB0(db.Model):
    __bind_key__ = 'db-0'
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    likes = db.Column(db.Integer, nullable=False)
    dislikes = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(100), primary_key=False)
    major = db.Column(db.String(100), nullable=False)
    time_created = db.Column(db.DateTime, server_default=db.func.now())

class CommentDB0(db.Model):
    __bind_key__ = 'db-0'
    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    postId = db.Column(db.Integer, nullable=False)
    time_created = db.Column(db.DateTime, server_default=db.func.now())

class UserDB1(db.Model):
    __bind_key__ = 'db-1'
    __tablename__ = 'user'
    username = db.Column(db.String(100), primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    major = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    time_created = db.Column(db.DateTime, server_default=db.func.now())

class PostDB1(db.Model):
    __bind_key__ = 'db-1'
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    likes = db.Column(db.Integer, nullable=False)
    dislikes = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(100), primary_key=False)
    major = db.Column(db.String(100), nullable=False)
    time_created = db.Column(db.DateTime, server_default=db.func.now())

class CommentDB1(db.Model):
    __bind_key__ = 'db-1'
    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    postId = db.Column(db.Integer, nullable=False)
    time_created = db.Column(db.DateTime, server_default=db.func.now())

class UserDB2(db.Model):
    __bind_key__ = 'db-2'
    __tablename__ = 'user'
    username = db.Column(db.String(100), primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    major = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    time_created = db.Column(db.DateTime, server_default=db.func.now())

class PostDB2(db.Model):
    __bind_key__ = 'db-2'
    __tablename__ = 'post'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    likes = db.Column(db.Integer, nullable=False)
    dislikes = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String(100), primary_key=False)
    major = db.Column(db.String(100), nullable=False)
    time_created = db.Column(db.DateTime, server_default=db.func.now())

class CommentDB2(db.Model):
    __bind_key__ = 'db-2'
    __tablename__ = 'comment'
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    postId = db.Column(db.Integer, nullable=False)
    time_created = db.Column(db.DateTime, server_default=db.func.now())

# User routes
@app.post('/user/login')
def login_user():
    username = request.get_json().get('username')
    password = request.get_json().get('password')

    user = None
    try:
        user = UserDB2.query.filter_by(username=username).first()
    except:
        try:
            user = UserDB1.query.filter_by(username=username).first()
        except:
            try:
                user = UserDB0.query.filter_by(username=username).first()
            except:
                return '', 500

    if user is not None and (user.password == password):
        return jsonify({'userUserName': user.username, 'userMajor': user.major }), 200
    else:
        return '', 401

@app.post('/user')
def create_user():
    username = request.get_json().get('username')
    first_name = request.get_json().get('first_name')
    last_name = request.get_json().get('last_name')
    major = request.get_json().get('major')
    password = request.get_json().get('password')
    
    task = worker.send_task('tasks.commit_user', kwargs={'username': username, 'first_name': first_name, 'last_name': last_name, 'major': major, 'password': password})
    user = task.get()

    return user, 201

@app.delete('/user/<username>')
def delete_user(username):
    user = UserDB0.query.filter_by(username=username).first()
    if user is None:
        return '', 404
    else:
        db.session.delete(user)
        db.session.commit()
        return '', 204

# Post routes
@app.post('/major-posts')
def get_major_posts():
    major = request.get_json().get('major')

    posts = None
    try:
        posts = PostDB2.query.filter_by(major=major).order_by(PostDB0.time_created.desc()).all()
    except:
        try:
            posts = PostDB1.query.filter_by(major=major).order_by(PostDB1.time_created.desc()).all()
        except:
            try:
                posts = PostDB0.query.filter_by(major=major).order_by(PostDB2.time_created.desc()).all()
            except:
                return '', 500

    if not posts:
        return jsonify({'posts': []}), 200
    else:
        posts_json = []
        for post in posts:
            posts_json.append({'id': post.id, 'title': post.title, 'content': post.content, 'likes': post.likes, 'dislikes': post.dislikes, 'username': post.username, 'major': post.major, 'time_created': post.time_created})
        return jsonify({'posts': posts_json}), 200

@app.get('/post/<int:id>')
def get_post(id):
    post = PostDB0.query.filter_by(id=id).first()
    if post is None:
        return '', 404
    else:
        return jsonify({'id': post.id, 'title': post.title, 'content': post.content, 'likes': post.likes, 'dislikes': post.dislikes, 'username': post.username, 'major': post.major, 'time_created': post.time_created}), 200

@app.post('/post')
def create_post():
    title = request.get_json().get('title')
    content = request.get_json().get('content')
    likes = 0
    dislikes = 0
    username = request.get_json().get('username')
    major = request.get_json().get('major')
    
    task = worker.send_task('tasks.commit_post', kwargs={'title': title, 'content': content, 'likes': likes, 'dislikes': dislikes, 'username': username, 'major': major})
    post = task.get()

    return post, 201

@app.delete('/post/<int:id>')
def delete_post(id):
    post = PostDB0.query.filter_by(id=id).first()
    if post is None:
        return '', 404
    else:
        db.session.delete(post)
        db.session.commit()
        return '', 204

# Comment routes
@app.post('/post-comments')
def get_post_comments():
    postId = request.get_json().get('postId')
    comments = CommentDB0.query.filter_by(postId=postId).order_by(CommentDB0.time_created.desc()).all()

    comments = None
    try:
        comments = CommentDB2.query.filter_by(postId=postId).order_by(CommentDB0.time_created.desc()).all()
    except:
        try:
            comments = CommentDB1.query.filter_by(postId=postId).order_by(CommentDB0.time_created.desc()).all()
        except:
            try:
                comments = CommentDB0.query.filter_by(postId=postId).order_by(CommentDB0.time_created.desc()).all()
            except:
                return '', 500

    if not comments:
        return jsonify({'comments': []}), 200
    else:
        comments_json = []
        for comment in comments:
            comments_json.append({'id': comment.id, 'content': comment.content, 'username': comment.username, 'postId': comment.postId, 'time_created': comment.time_created})
        return jsonify({'comments': comments_json}), 200

@app.get('/comment/<int:id>')
def get_comment(id):
    comment = CommentDB0.query.filter_by(id=id).first()
    if comment is None:
        return '', 404
    else:
        return jsonify({'id': comment.id, 'content': comment.content, 'username': comment.username, 'postId': comment.postId, 'time_created': comment.time_created}), 200

@app.post('/comment')
def create_comment():
    content = request.get_json().get('content')
    username = request.get_json().get('username')
    postId = request.get_json().get('postId')
    
    task = worker.send_task('tasks.commit_comment', kwargs={'content': content, 'username': username, 'postId': postId})
    comment = task.get()

    return comment, 201

@app.delete('/comment/<int:id>')
def delete_comment(id):
    comment = CommentDB0.query.filter_by(id=id).first()
    if comment is None:
        return '', 404
    else:
        db.session.delete(comment)
        db.session.commit()
        return '', 204
    
@app.post('/init-dbs')
def initialize_dbs():
    #add fake users
    username = "ab"
    first_name = "ab"
    last_name = "ab"
    major = "CPSC"
    password = "Passwd01!"
    
    task1 = worker.send_task('tasks.commit_user', kwargs={'username': username, 'first_name': first_name, 'last_name': last_name, 'major': major, 'password': password})
    
    username = "cd"
    first_name = "cd"
    last_name = "cd"
    major = "CPSC"
    password = "Passwd01!"
    
    task2 = worker.send_task('tasks.commit_user', kwargs={'username': username, 'first_name': first_name, 'last_name': last_name, 'major': major, 'password': password})
    
    username = "de"
    first_name = "de"
    last_name = "de"
    major = "SENG"
    password = "Passwd01!"
    
    task3 = worker.send_task('tasks.commit_user', kwargs={'username': username, 'first_name': first_name, 'last_name': last_name, 'major': major, 'password': password})
    
    #add fake posts
    title = "I love CPSC 559"
    content = "Jalal is the best Prof"
    likes = 100
    dislikes = 20
    username = "ab"
    major = "CPSC"

    post = PostDB0.query.filter_by(content=content).first()
    if post is None:
        task4 = worker.send_task('tasks.commit_post', kwargs={'title': title, 
                                                         'content': content, 
                                                         'likes': likes, 
                                                         'dislikes': dislikes, 
                                                         'username': username, 
                                                         'major': major})
    title = "I love CPSC 559"
    content = "Mushfek is the best TA"
    likes = 63
    dislikes = 17
    username = "cd"
    major = "CPSC"

    post = PostDB0.query.filter_by(content=content).first()
    if post is None:
        task5 = worker.send_task('tasks.commit_post', kwargs={'title': title, 
                                                         'content': content, 
                                                         'likes': likes, 
                                                         'dislikes': dislikes, 
                                                         'username': username, 
                                                         'major': major})
    title = "I love CPSC 559"
    content = "Nich is a great TA"
    likes = 45
    dislikes = 20
    username = "de"
    major = "CPSC"

    post = PostDB0.query.filter_by(content=content).first()
    if post is None:
        task6 = worker.send_task('tasks.commit_post', kwargs={'title': title, 
                                                         'content': content, 
                                                         'likes': likes, 
                                                         'dislikes': dislikes, 
                                                         'username': username, 
                                                         'major': major})
        
    #fake comments
    content = "I hundred percent agreeee"
    username = "ab"
    postId = "1"
    
    comment = CommentDB0.query.filter_by(content=content).first()
    if comment is None:
        task = worker.send_task('tasks.commit_comment', kwargs={'content': content, 'username': username, 'postId': postId})
        
    content = "I hundred percent agreeee"
    username = "cd"
    postId = "2"
    
    comment = CommentDB0.query.filter_by(content=content).first()
    if comment is None:
        task = worker.send_task('tasks.commit_comment', kwargs={'content': content, 'username': username, 'postId': postId})

    
    return '', 201
with app.app_context():
    if CREATE_TABLE == '1':
        db.create_all(bind_key=['db-0', 'db-1', 'db-2'])

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
