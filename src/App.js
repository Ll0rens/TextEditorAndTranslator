import React, { useState, useRef } from "react";
import RichTextEditor from "./Components/RichTextEditor";
import Button from '@material-ui/core/Button'
import "./App.css";
import parse from 'html-react-parser';
var aws = require('aws-sdk/dist/aws-sdk-react-native');

const mapObj = {"S3":"<a href='https://aws.amazon.com/s3/' >Simple Storage Service (S3)</a>",
Gateway:'<a href="https://aws.amazon.com/api-gateway/" >API Gateway</a>',
Lambda: '<a href="https://aws.amazon.com/lambda/" >Lambda</a>',
MSK: '<a href="https://aws.amazon.com/msk/" >Amazon Managed Streaming for Apache Kafka (MSK)</a>'
};

//Amazon configuration parameters
aws.config = new aws.Config();
aws.config.accessKeyId = "YOUR_ACCESS_KEY";
aws.config.secretAccessKey = "YOUR_SECRET_ACCESS_KEY";
aws.config.region = "eu-west-1";
var finaldata = "";

function replaceAll(str,mapObj){
  var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
  return str.replace(re, function(matched){
      return mapObj[matched];
  });
}

const App = () => {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [messageTranslated, setMessageTranslated] = useState("");
  const [messageUpdatedTranslated, setMessageUpdatedTranslated] = useState('');
  const [translatedfinaldata, settranslatedfinalData] = useState('');

  //This function is called when something in the first text box changes
  const getValue = (value) => {
    setValue(value);
    var data = value.replace(/<[^>]+>/g, '');
    setMessage(data);
    setValue(data);
  }
  //This handles the logic of the Translate BUTTON
  const handleSubmit = (e) => {
    const translate = new aws.Translate({ region: 'eu-west-1' });
    const SourceLanguageCode = "es";
    const TargetLanguageCode = "en";
    const Text = value;

    e.preventDefault()

          const params = {
              SourceLanguageCode, TargetLanguageCode, Text
          }

          try {
              translate.translateText(params, (err, data) => {
                  if (err) {
                      if (err.code == 'MissingRequiredParameter') {
                          console.log("ERROR 1: " + err);
                      }
                      if (err.code == 'MultipleValidationErrors') {
                          console.log("ERROR 2: " + err );
                      }
                          console.log("ERROR 3 " + err );
                  } else {
                  finaldata = data;

                  setMessageTranslated(finaldata.TranslatedText);
                  const dataNew = finaldata.TranslatedText;
                  let mod = replaceAll(dataNew, mapObj);
                  let modificado = "\"" + mod + "\"";
                  setMessageUpdatedTranslated(mod);
                }
              });
          } catch (error) {
              console.log("ERROR HERE: " + error);
          }
  }

  //It returns Two text box and one button
  return (
    <div className="row">
      <div className="col-md-6" style={{ margin: "auto", marginTop: "50px" }}>
        <div style={{ textAlign: "center" }}>
          <h3>Email Editor </h3>
        </div>
        <p> <RichTextEditor initialValue="" getValue={getValue} /></p>
        <p> <RichTextEditor initialValue={messageUpdatedTranslated} getValue={getValue} /></p>
        <form noValidate autoComplete='off'>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Translate</Button>
        </form>
      </div>
    </div>
  );
};

export default App;
