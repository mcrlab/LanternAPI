import tweepy
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import json
import requests
from colors import color_list
import random
import math
import os
import sys
from time import sleep

#consumer key, consumer secret, access token, access secret and api url
ckey = os.environ['ckey']
csecret = os.environ['csecret']
atoken = os.environ['atoken']
asecret = os.environ['asecret']
url = os.environ['url']

def fetch_light_data():
    json_data = requests.get(url).json()
    return json_data['lights']

def colour_all(lights, color):
    x = random.uniform(0,1)
    y = random.uniform(0,1)
    print("Setting color " + color['text'] + " from " + str(x) + ", " + str(y))
    data = {
        "lights" :[]
    }

    for light in lights:
        distanceX = light['position']['x'] - x
        distanceY = light['position']['y'] - y
        distance = math.sqrt((distanceX * distanceX) + (distanceY * distanceY))
        data['lights'].append({
            "id": light['id'],
            "color": color['hex'],
            "time": 1000,
            "delay": 1000 * distance
        })
    response = requests.put(url, json=data)


class listener(StreamListener):

    def on_data(self, data):
        try:
            d = json.loads(data)
            text = d['text']

            for color in color_list:
                if text.find(color['text']) > -1:
                    
                    lights = fetch_light_data()
                    colour_all(lights, color)
                    pass
        except KeyError as e:
            print(e)

        return(True)

    def on_error(self, status):
        print(status)




try:
    if __name__ == '__main__':
        print("Connecting to twitter")
        auth = OAuthHandler(ckey, csecret)
        auth.set_access_token(atoken, asecret)
        twitterStream = Stream(auth, listener())
        twitterStream.filter(track=['color', 'colour'])
# various exception handling blocks
except KeyboardInterrupt:
    sys.exit()
except AttributeError as e:
    print('AttributeError was returned, stupid bug')
    pass
except tweepy.TweepError as e:
    print('Below is the printed exception')
    print(e)
    if '401' in e:    
        # not sure if this will even work
        print('Below is the response that came in')
        print(e)
        sleep(60)
        pass
    else:
        #raise an exception if another status code was returned, we don't like other kinds
        raise e
except Exception as e:
    print('Unhandled exception')
    raise e
