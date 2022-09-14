import React, { useState, useRef } from "react";
import RichTextEditor from "./Components/RichTextEditor";
import RichTextEditorRead from "./Components/RichTextEditorRead";
import Button from '@material-ui/core/Button'
import "./App.css";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { spacing } from "@material-ui/system";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
var aws = require('aws-sdk/dist/aws-sdk-react-native');


//import EditIcon from '@mui/icons-material/Edit';
const mapObj = {
S3:"<a href='https://aws.amazon.com/s3/' >Simple Storage Service</a><a><br></br>",
EBS:"<a href='https://aws.amazon.com/ebs/' >Elastic Block Storage</a><a><br></br>",
Lambda: "<a href='https://aws.amazon.com/lambda/' >AWS-lambda</a><a>",
MSK:"<a href='https://aws.amazon.com/msk/' >Amazon Managed Streaming for Apache Kafka</a><a><br></br>"
};

const options = [
  'Language',
  'Spanish',
  'Italian'
];

//Amazon configuration parameters
aws.config = new aws.Config();
aws.config.accessKeyId = "SECRET_KEY";
aws.config.secretAccessKey = "SECRET_ACCESS_KEY";
aws.config.region = "eu-west-1";

function replaceAll(str,mapObj){
  var re = new RegExp("\\b(" + Object.keys(mapObj).join("|") + ")\\b","g");
  return str.replace(re, function(matched){
      return mapObj[matched];
  });
}

const App = () => {
  const [anchorEl, setAnchorEl] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");
  const open = Boolean(anchorEl);
  const [language, setLanguage] = useState("");
  const [value, setValue] = useState("");
  const [messageUpdatedTranslated, setMessageUpdatedTranslated] = useState('');
  const [newvalue, setnewvalue] = useState('');
  const [resource, setResource] = useState('');

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorEl(event.currentTarget);
  };
  const handleAddResource = (event) => {
    setResource(event.target.value);
    console.log("The value is " + resource);


  }
  const handleMenuItemClick = (
  event: React.MouseEvent<HTMLElement>,
  index: number,
  ) => {
         setSelectedIndex(index);
         setAnchorEl(null);
         if (index == 1) {
           setLanguage("es");
           setnewvalue("");
         } else {
           setLanguage("it");
           setnewvalue("");
         }
       };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getValue = (value) => {
    let updated = replaceAll(value, mapObj);
    setValue(updated);
  }
  //This handles the logic of the Translate BUTTON
  const handleSubmit = (e) => {
    const translate = new aws.Translate({ region: 'eu-west-1' });
    const SourceLanguageCode = "en";
    const TargetLanguageCode = language;
    const Text = value;
    const params = {SourceLanguageCode, TargetLanguageCode, Text}

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
           setMessageUpdatedTranslated(data.TranslatedText);
       }});
     } catch (error) {
       console.log("Not possible to translate " + error);
     }

   }

   const handleSubmit2 = (e) => {
     const url = "https://aws.amazon.com/search/?searchQuery=" + resource;
     if (resource != "") { const ventana = window.open(url,"_blank");}
     setResource("");
   }
  //It returns Two text box and one button
  return (
    <div className="row">
      <div className="col-md-6" style={{ margin: "auto", marginTop: "30px" }}>
        <div style={{ textAlign: "center" }}>
        </div>
        <p> <RichTextEditor initialValue={value} getValue={getValue} /></p>
        <p> <RichTextEditorRead initialValue={messageUpdatedTranslated} /></p>
          <form noValidate autoComplete='off'>
          <Stack spacing={2} direction="row">
              <Button size="large" variant="contained" color="primary" onClick={handleSubmit}>Translate</Button>
              <Button size="large" variant="contained" color="primary" onClick={handleSubmit2}>Search resource</Button>
          </Stack>
            <TextField margin='normal' onChange={handleAddResource}
            size='small' fullWidth='true' id="outlined-basic" label="Search a resource" variant="outlined" >
            </TextField>
            <List
              component="nav"
              aria-label="Device settings"
              sx={{ bgcolor: 'background.paper' }} >
              <ListItem
                button
                id="lock-button"
                aria-haspopup="listbox"
                aria-controls="lock-menu"
                aria-label="Language"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClickListItem} >
              <ListItemText
                primary="Choose a Language"
                secondary={options[selectedIndex]}/>
              </ListItem>
            </List>
            <Menu
              id="lock-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'lock-button',
                role: 'listbox' }}>
                {options.map((option, index) => (
                  <p>
                  <MenuItem
                    key={option}
                    disabled={index === 0}
                    selected={index === selectedIndex}
                    onClick={(event) => handleMenuItemClick(event, index)}>
                    {option}
                  </MenuItem>
                </p>))}
            </Menu>
          </form>
      </div>
    </div>
  );
};

export default App;
