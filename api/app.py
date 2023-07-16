from flask import Flask, render_template, jsonify, request
from bs4 import BeautifulSoup
import urllib.request, json, requests
import time

def status(name):
    client_id = "uyPR8WHmfDwPcfM24CmI"
    client_secret = "ouydKN1Bky"
    encText = urllib.parse.quote(f"{name}")
    url = "https://openapi.naver.com/v1/search/encyc.json?query=" + encText
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id",client_id)
    request.add_header("X-Naver-Client-Secret",client_secret)
    response = urllib.request.urlopen(request)
    rescode = response.getcode()
    if(rescode==200):
        respon = json.load(response)
        links=[i["link"] for i in respon["items"]]
        try:
            for link in links:
                res = requests.get(link)
                res.raise_for_status()
                soup = BeautifulSoup(res.text, "lxml")
                h2 = soup.find("h2", attrs={"class": "title"})
                span = h2.find('span')
                if "두산백과" in span:
                    body = soup.tbody
                    ths = [i.text for i in body.find_all("span", {"class": "title"})]
                    tds = [i.text.replace('\n', '').split() for i in body.find_all("td")]
                    dic={}
                    for i in range(len(ths)):
                        dic[ths[i]]=dic.get(ths[i], " ".join(tds[i]))
                    return dic
        except:
            return {'error': 'not'}
    else:
        print("Error Code:" + rescode)

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("main.html")

@app.route('/get-status', methods=['GET', 'POST'])
def get_status():
    if request.method == 'GET':
        received = request.form.get('value')
        print(received)

        a= status(str(received))

        return jsonify(a)
    elif request.method == 'POST':
        received = request.form.get('value')
        print(received)

        a = status(str(received))

        return jsonify(a)
