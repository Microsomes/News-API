from flask import Flask, jsonify
from flask import json
app = Flask(__name__)

from bs4 import BeautifulSoup
import requests

crawler_name="SKY_NET_MICROSOMES_OFFICIAL_CRAWLER"
# def crawlSun_news():
#     toReturn = []
#     websitesToCrawl = [
#         "https://www.thesun.co.uk/news/uknews",
#         "https://www.thesun.co.uk/news/worldnews",
#         "https://www.thesun.co.uk/news/politics",
#         "https://www.thesun.co.uk/fabulous",
#         "https://www.thesun.co.uk/money"
#     ]

#     for site in websitesToCrawl:
#         print("crawling from site"+site)
#         response = requests.get(site)
#         crawlJob = BeautifulSoup(response.text, 'html.parser')
#         stories = crawlJob.find_all(class_="sun-row teaser")
#         for n in stories:
#             curStory= n

#             curTitle=curStory.find(class_="teaser__copy-container").get_text().replace("\n","")

#             curDescription= curStory.find(class_="teaser__lead").get_text()

#             curLink= curStory.find(class_="teaser-anchor").get("href")

#             curImage= curStory.find(class_="delayed-image-load-mobile").get("data-src")
#             curTag= site.split("/")[4]

#             curRes={
#                 "title": curTitle,
#                 "description": curDescription,
#                 "urlToImage": curImage,
#                 "url": "https://news.sky.com" + curLink,
#                 "author": "Chris Mahatman",
#                 "tag": curTag
#             }
#             toReturn.append(curRes)
#     return toReturn




def crawlSky_news():
    toReturn = []
    websitesToCrawl = [
        "https://news.sky.com/uk",
        "https://news.sky.com/world",
        "https://news.sky.com/politics",
        "https://news.sky.com/us",
         ]

    for site in websitesToCrawl:
        response = requests.get(site)
        print("crawling"+site)
        crawlJob = BeautifulSoup(response.text, 'html.parser')
        stories = crawlJob.find_all(class_="sdc-news-story-grid__card")



        for n in stories:
            curStory = n
            curTitle = curStory.find(class_="sdc-news-story-grid__headline").get_text()
            curLink = curStory.find(class_="sdc-news-story-grid__link").get("href")
            curImage = curStory.find(class_="sdc-news-story-grid__media-element").get("src")
            curDescription = curStory.find(class_="sdc-news-story-grid__body").get_text()
            curTag= site.split("/")[3]
            curRes = {
                "title": curTitle,
                "description": curDescription,
                "urlToImage": curImage,
                "url":"https://news.sky.com"+curLink,
                "author":"Chris Mahatman",
                "tag":curTag
            }
            toReturn.append(curRes)
    return toReturn

def add_to_db_sky():
    try:
        ADD_URL="https://socialstation.info/newsv2/add"
        #calls scialstation api and posts the data
        data= crawlSky_news()
        for n in data:
            curData= n
            curTitle=curData["title"]
            curDescription=curData["description"]
            curImage= curData["urlToImage"]
            curTag= curData["tag"]
            curUrl= curData["url"]
            curAuthor= curData["author"]
            print(curData)
            requests.post(ADD_URL, json={
                "title": curTitle,
                "description": curDescription,
                "source": "sky news",
                "author": curAuthor,
                "url": curUrl,
                "image": curImage,
                "tag": curTag,
                "sourceImage": "https://yt3.ggpht.com/a-/ACSszfG15iM-AMmPIK9vbGpvmAUVH7AcPXi3A6drxQ=s900-mo-c-c0xffffffff-rj-k-no"
            })
    except Exception:
        print("sorry an error has occured")

add_to_db_sky()



#add_to_db_sun()
#scrapes and adds

# @app.route("/")
# def hello():
#     return jsonify({
#         "msg":"Welcome to Microsomes Skynet. The Worlds best web scraper for news"
#     })
# @app.route("/skynet/<source>")
# def scrape(source):
#     if(source=="sky"):
#         sky=crawlSky_news()
#         totalResults=len(sky)
#         return jsonify({
#              "data":sky,
#             "totalResults": totalResults,
#             "status":"scraped from skynews"
#
#         })
#     if(source=="sun"):
#         sun=crawlSun_news()
#         totalResults=len(sun)
#         return jsonify({
#             "data": sun,
#             "totalResults": totalResults,
#             "status": "scraped from sunnews"
#         })
#
#
