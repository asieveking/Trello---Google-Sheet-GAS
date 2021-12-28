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
  dashboard_sheet+=" - Trello"
  if(!ss.getSheetByName(dashboard_sheet)){
    ss.insertSheet(dashboard_sheet);
  }
  
  let sheet = ss.getSheetByName(dashboard_sheet);       
  sheet.clear();
  
  //Print first row on spreadsheet (Headers)
  sheet.appendRow(["List 📑","Cards 📌","Description 🧾","Tags 📍" , "Checked ✔" ,"Check Items 🔳","Expiration date ⏰",
                   "Completed before the expiration date?  📆","Member Card 👨‍👧","Member Board 👨‍👩‍👧‍👧","Admin Board 👨‍🚀", "Link","Card ID","Board Name"])
  
 
  //Method GET Boards
  let boards=fetchUrl(url + "members/me/boards?fields=name,url,closed,memberships&members=all&" + key_and_token);
  
  
  for(let val in boards){
    final_column=sheet.getLastColumn()
    let board=boards[val];
    const obj_custom_field_title = new Object();
    if(board.name.toLowerCase().includes(dashboard)==false || board.closed==true ){continue} 
    
    // Parameter of Members
    let memberArray=[], admin_name="", member_name="";
    for(let i in board.members){
      for(let j in board.memberships){      
        if(board.members[i].id===board.memberships[j].idMember){          
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
    member_name= member_name.slice(0,-2)
    admin_name = admin_name.slice(0,-2)

    //Method GET Lists & Cards
    let lists = fetchUrl(url +"boards/" + board.id + "/lists?cards=open&" + key_and_token)
    
    for (let ite0 in lists) {
      let list = lists[ite0];
      
      for (let ite1 in list.cards) {
        let card = list.cards[ite1];
        let expiration_date="", expiration_date_Completed="";   
        if(card.due){
          expiration_date= new Date(card.due) 
          expiration_date_Completed=(card.dueComplete)? true: false //Operador condicional ternario         
        }
        let description =card.desc, check= card.badges.checkItems, checked= card.badges.checkItemsChecked; 
        
        //Method GET CardsCustomField
        let card_fields= fetchUrl(url + "cards/" + card.id + "?fields=name,idMembers&customFields=true&customFieldItems=true&" + key_and_token);
        
        //CustomFields ✴
        const obj_custom_field = new Object();
        if(Object.keys(card_fields.customFieldItems).length !== 0){
          customFieldsItem(card_fields.customFields, card_fields.customFieldItems, obj_custom_field,obj_custom_field_title)
        }
        Logger.log(obj_custom_field)
        //Parameters Members on Card
        let member_card="";       
        if(Object.keys(card_fields.idMembers).length !== 0){
          member_card=joinMemberCard(memberArray,card_fields);
        }   
        
        //Parameters Tag on Card
        let tag_name =""; 
        for(let ite in card.labels){
          tag_name = tag_name.concat(card.labels[ite].name," / ");            
        } 
        
        card.url ='=HYPERLINK("'+ card.url+'";"Link Card")' 
        
        //Print rows data on SpreadSheets
        sheet.appendRow([ list.name, card.name,description,tag_name.slice(0,-2), checked,check,expiration_date,expiration_date_Completed,member_card.slice(0,-2) ,member_name, admin_name, card.url,   card.id,board.name].concat([obj_custom_field.checked,obj_custom_field.date,obj_custom_field.text,obj_custom_field.number,obj_custom_field.option]));
        
      }  
    }
  // Logger.log(sheet.getLastColumn())
   
  
  titles=[obj_custom_field_title.title_checked,obj_custom_field_title.title_date,obj_custom_field_title.title_text,obj_custom_field_title.obj_custom_field_title,obj_custom_field_title.title_option]
  sheet.getRange(1,final_column+1,1,titles.length).setValues([titles])  
  }
}

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

function extractAndCalculateDateDiff(nameDate, statusTask){  
  if(nameDate.indexOf("[")!=-1 && nameDate.indexOf("]") !=-1 && !statusTask){
    let date= (nameDate.slice(nameDate.indexOf("[")+1,nameDate.indexOf("]"))).trim();   
    
    if(date.indexOf("/") !=  -1){
      date= date.split("/") 
    }else if(date.indexOf("-") !=  -1){
      date= date.split("-") 
    }else if(date.indexOf(".") !=  -1){
      date= date.split(".") 
    }else{
      return ""
    }
    date= new Date(date[2]+"/"+date[1]+"/"+date[0])// YYYY-MM-DD or YYYY/MM/DD
    let day=date.getDate(), month=date.getMonth()+1, year=date.getFullYear();
    if(typeof day !== 'number' || typeof month !=='number'|| typeof year !=='number') {return "";}
    
    let actualDate=new Date();
    //    let actualMonth=actualDate.getMonth()+1 //0=January, 1=February
    //    let actualDay=actualDate.getDate(),actualYear=actualDate.getFullYear();    
    
    return inDays(actualDate,date)      
  }
}

function inDays(actualDate, expectedDate) {
  let d2 = expectedDate.getTime();
  let d1= new Date(actualDate.getFullYear()+"/"+(actualDate.getMonth()+1)+"/"+actualDate.getDate());
  d1 = d1.getTime();  
  return parseInt((d2-d1)/(24*3600*1000));
}

   
function customFieldsItem(customFields, customFieldItems, obj_custom_field,obj_custom_field_title){    
  list_values_arrow=[]
  for(let i in customFields){          
    for(let j in customFieldItems){
      if( customFields[i].id===customFieldItems[j].idCustomField){

        list_values_header.push(customFields[i].name)
        Logger.log(customFieldItems[j].value)
        Logger.log(Object.keys(customFieldItems[j].value))
        // Logger.log(Object.keys(customFieldItems[j].value)=="checked")       
        value_field=customFields[i].name
        switch( customFields[i].type){
          case "checkbox":
            // Logger.log(customFieldItems[j].value.checked)
            obj_custom_field_title.title_checked=value_field
            obj_custom_field.checked=customFieldItems[j].value.checked
            break;
          case "date":
            //Logger.log(new Date(customFieldItems[j].value.date))
            obj_custom_field_title.title_date=value_field
            obj_custom_field.date=new Date(customFieldItems[j].value.date)
            break;
          case "text":
            // Logger.log(customFieldItems[j].value.text)
            obj_custom_field_title.title_text=value_field
            obj_custom_field.text=customFieldItems[j].value.text
            break;
          case "number":
            // Logger.log(customFieldItems[j].value.number)
            obj_custom_field_title.title_number=value_field
            obj_custom_field.number=parseFloat(customFieldItems[j].value.number)
            break;
          case "list":            
            // Logger.log(customOption(customFields[i],customFieldItems[j]))
            obj_custom_field_title.title_option=value_field
            obj_custom_field.option=customOption(customFields[i],customFieldItems[j])
            break;
          
        }
      }
    }
  } 
}

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


function memberObject(id,fullName, memberType) {
  return{
    id:id,
    fullName:fullName,
    memberType:memberType
  }
}

function onOpen(){
  initMenu()
  
}

let item_meta="Key and Token"
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
function SetData(data){
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
let api_key, api_token, dashboard
let list_values_header=[]







