//[You must be registered in the Trello account to obtain the API key]
//url key    *  https://trello.com/app-key *
//url token  * https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=[KEY] *

// Run function "Main ()" to start

function Main() {
  getData()
  const url= "https://api.trello.com/1/"; 
  const key_and_token = "key="+api_key+"&token="+api_token;
  let ss = SpreadsheetApp.getActiveSpreadsheet()  

  //Initialize Sheet  
  let dashboard_sheet=upperFirstLetter(dashboard) 
  //Name sheet
  dashboard_sheet+=" - Trello"
  // Create sheet if not exists
  if(!ss.getSheetByName(dashboard_sheet)){
    ss.insertSheet(dashboard_sheet);
  }
  //Get sheet by name
  let sheet = ss.getSheetByName(dashboard_sheet);
  // Clear sheet 
  sheet.clear();
  
  //Print first row on spreadsheet (Headers)
  sheet.appendRow(["List 📑","Cards 📌","Description 🧾","Tags 📍" , "Checked ✔" ,"Check Items 🔳","Expiration date ⏰",
                   "Completed before the expiration date?  📆","Member Card 👨‍👧","Member Board 👨‍👩‍👧‍👧","Admin Board 👨‍🚀", "Link","Card ID","Board Name"])
  
  let list_title=[], list_values=[],final_column=sheet.getLastColumn()     
  //Method GET Boards
  let boards=fetchUrl(url + "members/me/boards?fields=name,url,closed,memberships&members=all&" + key_and_token);    
  
  for(let b in boards){    
    let board=boards[b];  
    //skip if dashboard not contain name
    if(board.name.toLowerCase().includes(dashboard)==false || board.closed==true ){continue}     
    //Get all member of dashboard
    let memberArray=[], admin_name="", member_name="";
    for(let i in board.members){
      for(let j in board.memberships){      
        if(board.members[i].id===board.memberships[j].idMember){ 
          // Get sdmin dashhboard
          if(board.memberships[j].memberType==="admin")
          {         
            admin_name+= board.members[i].fullName+" / ";                     
          }          
          member_name+= board.members[i].fullName+" / ";          
          memberArray.push( new memberObject(board.members[i].id,board.members[i].fullName,board.memberships[j].memberType));           
          break;
        }
      }      
    }
    //clean "/ " to the end
    member_name= member_name.slice(0,-2)
    admin_name = admin_name.slice(0,-2)

    //Method GET Lists & Cards
    let lists = fetchUrl(url +"boards/" + board.id + "/lists?cards=open&" + key_and_token)    

    for (let l in lists) {
      let list = lists[l];      
      for (let c in list.cards) {       
        let dict_custom_fields={}, card = list.cards[c], expiration_date= expiration_date_Completed="";          
        if(card.due){
          expiration_date= new Date(card.due) 
          expiration_date_Completed=(card.dueComplete)? true: false //Operador condicional ternario         
        }
        let description =card.desc, check= card.badges.checkItems, checked= card.badges.checkItemsChecked; 
        
        //Method GET CardsCustomField
        let card_fields= fetchUrl(url + "cards/" + card.id + "?fields=name,idMembers&customFields=true&customFieldItems=true&" + key_and_token);
        
        //CustomFields ✴ 
        if(Object.keys(card_fields.customFieldItems).length !== 0){
          customFieldsItem(card_fields.customFields, card_fields.customFieldItems, dict_custom_fields,list_title)     

          for(let i in list_title){            
            if (dict_custom_fields[list_title[i]] !== null){
              list_values.push(dict_custom_fields[list_title[i]])
            }else{
              list_values.push("")
            }
          }
        }
        
        //Parameters Members on the card
        let member_card="";       
        if(Object.keys(card_fields.idMembers).length !== 0){
          member_card=joinMemberCard(memberArray,card_fields);
        }   
        
        //Parameters tag on the card
        let tag_name =""; 
        for(let i in card.labels){
          tag_name = tag_name.concat(card.labels[i].name," / ");            
        } 

        // Create HYPERLINK
        card.url ='=HYPERLINK("'+ card.url+'";"Link Card")' 
        
        //Print rows data on spreadsheets
        sheet.appendRow([ list.name, card.name,description,tag_name.slice(0,-2), checked,check,expiration_date,expiration_date_Completed,member_card.slice(0,-2) ,member_name, admin_name, card.url,  card.id,board.name].concat(list_values));
        list_values=[]
      }  
    }   
  }
  sheet.getRange(1,final_column+1,1, list_title.length).setValues([list_title])  
}
// Request API
function fetchUrl(urlBuilt){
  // Utilities.sleep(300); //300 milliseconds (activate when rate limit exists)
  let response = UrlFetchApp.fetch(urlBuilt);//                   
  return  JSON.parse(response.getContentText());   
}

function joinMemberCard(memberArray,card_fields){
  let member_card="";
  for(let i in card_fields.idMembers){
    for(let j in memberArray){                
      if(card_fields.idMembers[i]===memberArray[j].id){                  
        member_card= member_card.concat(memberArray[j].fullName, " / ");
        break;
      }
    }
  }
  return member_card;
}
// Fill custom fields  
function customFieldsItem(customFields, customFieldItems, dict_custom_fields, list_title){    
  list_values_arrow=[]
  for(let i in customFields){          
    for(let j in customFieldItems){
      if( customFields[i].id===customFieldItems[j].idCustomField){
        // Logger.log(customFieldItems[j].value)
        // Logger.log(Object.keys(customFieldItems[j].value))
        title=customFields[i].name
        if (list_title.length===0 || list_title.find(element => element === title) == null ){
           list_title.push(title)
        }        
        // Logger.log(Object.keys(customFieldItems[j].value)=="checked")               
        switch( customFields[i].type){
          case "checkbox":
            // Logger.log(customFieldItems[j].value.checked)            
            dict_custom_fields[title]=customFieldItems[j].value.checked
            break;
          case "date":
            //Logger.log(new Date(customFieldItems[j].value.date))            
            dict_custom_fields[title]=new Date(customFieldItems[j].value.date)
            break;
          case "text":
            // Logger.log(customFieldItems[j].value.text)
            dict_custom_fields[title]=customFieldItems[j].value.text
            break;
          case "number":
            // Logger.log(customFieldItems[j].value.number)            
            dict_custom_fields[title]=parseFloat(customFieldItems[j].value.number)
            break;
          case "list":            
            // Logger.log(customOption(customFields[i],customFieldItems[j]))            
            dict_custom_fields[title]=customOption(customFields[i],customFieldItems[j])
            break;
        }
      }
    }
  } 
}
// Search option selected
function customOption (customField, customFieldItems){  
  for(let i in customField.options){
    if(customFieldItems.idValue===customField.options[i].id){
      return customField.options[i].value.text
    }
  }
}

function upperFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
//object member
function memberObject(id,fullName, memberType) {
  return{
    id:id,
    fullName:fullName,
    memberType:memberType
  }
}
//Initialize Menu Trello
function onOpen(){
  initMenu()  
}


function initMenu(){
  let ui=SpreadsheetApp.getUi();
  let menu= ui.createMenu("Trello");  
  menu.addItem(item_meta, "showUserForm")
  menu.addToUi()
  
}

function showUserForm() {
  let template=HtmlService.createTemplateFromFile("userform");
  template.data= getData()
  let html=template.evaluate()
  html.setTitle(item_meta).setHeight(500).setWidth(500)
  SpreadsheetApp.getUi().showModalDialog(html, item_meta)
  //.showSidebar(html)
}
function getData(){
  let scriptProperty =PropertiesService.getScriptProperties()
  let key=scriptProperty.getProperty("Key")
  let token=scriptProperty.getProperty("Token")
  let dashboard=scriptProperty.getProperty("Dashboard")
  key=key != null? key:"" 
  token=token != null? token:"" 
  dashboard= dashboard != null? dashboard.toLowerCase():"" 
  let data={
    key: key,
    token:token,
    dashboard: dashboard
  }
  fillKeyToken(data)
  return data
}
function setData(data){
  let scriptProperty =PropertiesService.getScriptProperties()
  ScriptProperties.setProperty("Key", data.key) 
  ScriptProperties.setProperty("Token", data.token) 
  ScriptProperties.setProperty("Dashboard", data.dashboard)
  fillKeyToken(data)
}

function fillKeyToken(data){
  api_key = data.key
  api_token = data.token
  dashboard = data.dashboard
}
var api_key, api_token, dashboard,item_meta="Key and Token"







