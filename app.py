from flask import Flask, request, render_template
from langchain_community.llms import Ollama
from flask_cors import CORS

# creating instance of bakllava VLM from Ollama 
bakllava = Ollama(model="bakllava")
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')


# Route function to accept the image and process the image

@app.route('/analyse_image',methods=['POST'])
def hello():
    data = request.get_json()
    image_data = data.get('image')
    image_data = image_data.split(",")[1]
    llm_with_image_context = bakllava.bind(images=[image_data])
    prompt = """Analyse the image and give one word answer for all 3 questions
                    1) no of people (integer answer),
                    2) Direction they are looking tell direction, 
                    3) If there is any communication device present in true or false,
                """
    data = llm_with_image_context.invoke(prompt)
    # passing the output from Bakllava to llava for summerization which is done efficiently 
    lamamodel = Ollama(model="llava:13b")
    data = lamamodel.invoke(f'Analyse the given {data} find people count in intger, Direction they are looking (left, right, bottom, top, at-system), Communication device present(True or False) and return the output in JSON format only with one word answer  like ("people_count": 5,"direction-looking": "at-system","communication_device_present": false). \n I only need JSON output No any other string if there is no data return dummy like 0 ture or false')
    #printing for debugging purpose
    print(data)
    return {"data":data}


if __name__ == "__main__":
    app.run(debug=True)
