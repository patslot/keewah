#!/usr/bin/env python
# encoding: utf-8
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2,jinja2,os,csv,logging,json
from google.appengine.ext import db
from datetime import datetime
from datetime import timedelta

JINJA_ENVIRONMENT = jinja2.Environment(
loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
extensions=['jinja2.ext.autoescape'],
autoescape=True)

COUNTER_NAME = "CURRENT"

class Counter(db.Model):
    INDEX = db.IntegerProperty(default=0)
class User(db.Model):
    DATE_ADDED = db.DateTimeProperty(auto_now_add=True)
    DATE_MODIFIED = db.DateTimeProperty(auto_now=True)
    PLAYTIME = db.DateTimeProperty(default='')
    NAME = db.StringProperty(default='')
    PHONE = db.StringProperty(default='')
    EMAIL = db.StringProperty(default='')
    HKID = db.StringProperty(default='')
    MARK = db.StringProperty(default='')

    
    
class SubmitHandler(webapp2.RequestHandler):
    def get(self):
        self.submit()
    def post(self):
        self.submit()
    def submit(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        return_data = {}
        name = self.request.get('name')
        phone = self.request.get('phone')
        email = self.request.get('email')
        hkid = self.request.get('hkid')
        mark = self.request.get('mark')
        ptime = datetime.now() + timedelta(hours=8)
        status = self.retreatDataAndSave(phone,NAME=name, PHONE=phone, HKID=hkid,  EMAIL=email,  MARK=mark, PLAYTIME=ptime)
        if status ==  "got old item" :
            logging.info(status)
            return_data['status'] = 'REGISTER-FAIL'
            return_data['detail'] = '電話重覆登記，未能成功提交！'
        else :
            logging.info("create new item")
            return_data['status'] = 'SUCCESS'
            return_data['detail'] = '您已成功提交！'
        self.response.out.write(json.dumps(return_data))
    def checkPhoneDuplication(self,phone):
        duplicate_count = User.all().filter("PHONE = ",phone).count()
        if duplicate_count > 0 :
            return "true"
    def retreatDataAndSave(self,pphone,**kwds):
        #check phone duplication
        currentIndex = self.getCurrentCount()
        print "currentIndex" + str(currentIndex)
        save_status = self.addCounterAndSave(currentIndex,pphone,**kwds)
        if save_status == "SUCCESS" :
            return "create new item"
        else :
            print "RETRY"
            self.retreatDataAndSave(pphone,**kwds)
    @db.transactional(xg=True)
    def addCounterAndSave(self,currentIndex,pphone,**kwds):
        entity = User.get_by_key_name(str(currentIndex))
        if entity is None:
            Counter(key_name=COUNTER_NAME,INDEX=currentIndex).put()
            User(key_name=str(currentIndex),**kwds).put()
            return "SUCCESS"
        else :
            return "FAIL"
    @db.transactional
    def getCurrentCount(self):
        key_name = COUNTER_NAME
        entity = Counter.get_by_key_name(key_name)
        if entity is None:
            return 0
        else:
            return entity.INDEX + 1
    
class MainHandler(webapp2.RequestHandler):
    def post(self):
        self.submit()
        self.response.write('Hello world!')
    def get(self):
        self.test()
        self.response.write('Hello world!')
    def test(self):
        Counter(INDEX=1).put()
    def submit(self):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.addCounterAndSave()
        print self.getCurrentCount()
            
        
class ShowResultHandler(webapp2.RequestHandler): 
    def get(self):
        ppassword = self.request.get('password')
        if ppassword == "1234" :
            users = User.all()
            users.order('PLAYTIME')
            template_values = {
            	'users': users,
            }
            template = JINJA_ENVIRONMENT.get_template('admin.html')
            self.response.write(template.render(template_values))  
        else:
            template = JINJA_ENVIRONMENT.get_template('login.html')
            self.response.write(template.render())
            
  
            
app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/submit', SubmitHandler),
    ('/admin', ShowResultHandler)
], debug=True)
