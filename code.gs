//CHILE BI
//Version 1.2
//contact email: alejandro.sieveking@roche.com or chile.bi@roche.com

//[You must be registered in the Trello account to obtain the API key]
//url key    *  https://trello.com/app-key *
//url token  * https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=[KEY] *


// Run function "Main ()" to start

function Main() {
  GetData()
  const url= "https://api.trello.com/1/"; 
  const key_and_token = "key="+api_key+"&token="+api_token;
  let ss = SpreadsheetApp.getActiveSpreadsheet()  
  
  
  //Initialize Sheet  
  let dashboardsheet=UpperFirstLetter(dashboard) 
  dashboardsheet+=" - Trello"
  if(!ss.getSheetByName(dashboardsheet)){
    ss.insertSheet(dashboardsheet);
  }
  
  let sheet = ss.getSheetByName(dashboardsheet);       
  sheet.clear();
  
  //Print first row on spreadsheet (Headers)
  sheet.appendRow(["List","Task","Description","Tags" , "Checked" ,"Check Items","Expiration date",
                   "Completed before the expiration date?","Member Card","Member Board","Admin Board", "Link","Card ID","Board Name"])  
  
  
  //Method GET Boards
  let boards=FetchURL(url + "members/me/boards?fields=name,url,closed,memberships&members=all&" + key_and_token);
  
  
  for(let val in boards){
    let board=boards[val];
    
    if(board.name.toLowerCase().includes(dashboard)==false || board.closed==true ){continue} 
    
    // Parameter of Members
    let memberArray=[], adminName="", memberName="";
    for(let i in board.members){
      for(let j in board.memberships){      
        if(board.members[i].id===board.memberships[j].idMember){          
          if(board.memberships[j].memberType==="admin")
          {         
            adminName+= board.members[i].fullName+" / ";                     
          }
            memberName+= board.members[i].fullName+" / ";
          
          memberArray.push( new memberObject(board.members[i].id,board.members[i].fullName,board.memberships[j].memberType));           
          break;
        }
      }      
    }
    memberName= memberName.slice(0,-2)
    adminName = adminName.slice(0,-2)



    
    //Method GET Lists & Cards
    let lists = FetchURL(url +"boards/" + board.id + "/lists?cards=open&" + key_and_token)
    
    for (let ite0 in lists) {
      let list = lists[ite0];
      
      for (let ite1 in list.cards) {
        let card = list.cards[ite1];
        let expirationDate="", expirationDateCompleted="";   
        if(card.due){
          expirationDate= new Date(card.due) 
          expirationDateCompleted=(card.dueComplete)? true: false //Operador condicional ternario         
        }
        let description =card.desc, check= card.badges.checkItems, checked= card.badges.checkItemsChecked; 
        
        //Method GET CardsCustomField
        let cardFields= FetchURL(url + "cards/" + card.id + "?fields=name,idMembers&customFields=true&customFieldItems=true&" + key_and_token);
        
        //CustomFields ✴
        if(Object.keys(cardFields.customFieldItems).length !== 0){
          CustomFieldsItem(cardFields.customFields, cardFields.customFieldItems)
        }
        
        //Parameters Members on Card
        let memberCard="";       
        if(Object.keys(cardFields.idMembers).length !== 0){
          memberCard=joinMemberCard(memberArray,cardFields);
        }   
        
        //Parameters Tag on Card
        let tagName =""; 
        for(let ite in card.labels){
          tagName = tagName.concat(card.labels[ite].name," / ");            
        } 
        
        card.url ='=HYPERLINK("'+ card.url+'";"Link Card")' 
        
        //Print rows data on SpreadSheets
        sheet.appendRow([ list.name, card.name,description,tagName.slice(0,-2), checked,check,expirationDate,expirationDateCompleted,memberCard.slice(0,-2) ,memberName, adminName, card.url,card.id,board.name]);
        isMilestone=strategicProject=initiativeLead=agileFacilitator=statusJustification=cost=memberNameCustom=area=""
      }  
    }
  }
}

function FetchURL(urlBuilt){
  // Utilities.sleep(300); //300 milliseconds (activate when rate limit exists)
  let response = UrlFetchApp.fetch(urlBuilt);//                   
  return  JSON.parse(response.getContentText());   
}

function joinMemberCard(memberArray,cardFields){
  let memberCard="";
  for(let i in cardFields.idMembers){
    for(let j in memberArray){                
      if(cardFields.idMembers[i]===memberArray[j].id){                  
        memberCard= memberCard.concat(memberArray[j].fullName, " / ");
        break;
      }
    }
  }
  return memberCard;
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

   
function CustomFieldsItem(customFields, customFieldItems){  
  for(let i in customFields){          
    for(let j in customFieldItems){
      if( customFields[i].id===customFieldItems[j].idCustomField){
        
        switch(customFields[i].name) {
          case "Area":
            area=CustomOption(customFields[i],customFieldItems[j]);       
            break;       
          case "Is Milestone?":
            isMilestone=customFieldItems[j].value.checked
            break;
          case "Strategic Project (PE)":
            strategicProject= CustomOption(customFields[i],customFieldItems[j])
            break;   
          case "Initiative Lead":
            initiativeLead=customFieldItems[j].value.text
            break; 
          case "Agile Facilitator":
            agileFacilitator = CustomOption(customFields[i],customFieldItems[j])
            break;
          case "Status Justification":
            statusJustification=customFieldItems[j].value.text
            break;                   
          case "Cost (CLP)":
            cost=customFieldItems[j].value.number
            break;     
          case "Member Name":
            memberNameCustom=customFieldItems[j].value.text
            break;
          
            
        }
      }
    }
  } 
}
// Type of CustomFields 
// Text:  customFieldItems[j].value.text;
// Date:  new Date(customFieldItems[j].value.date);
// Number:   customFieldItems[j].value.number; 
// Options:  CustomOption(customFields[i],customFieldItems[j]); 
// Checked:  customFieldItems[j].value.checked; 

function CustomOption (customField, customFieldItems){  
  for(let i in customField.options){
    if(customFieldItems.idValue===customField.options[i].id){
      return customField.options[i].value.text
    }
  }
}
function UpperFirstLetter(string) {
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

let itemMeta="Key and Token"
function initMenu(){
  let ui=SpreadsheetApp.getUi();
  let menu= ui.createMenu("Trello");  
  menu.addItem(itemMeta, "showUserForm")
  menu.addToUi()
  
}

function showUserForm() {
  let template=HtmlService.createTemplateFromFile("userform");
  template.data= GetData()
  let html=template.evaluate()
  html.setTitle(itemMeta).setHeight(500).setWidth(500)
  SpreadsheetApp.getUi().showModalDialog(html, itemMeta)
  //.showSidebar(html)
}
function GetData(){
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
  FillKeyToken(data)
  return data
}
function SetData(data){
  let scriptProperty =PropertiesService.getScriptProperties()
  ScriptProperties.setProperty("Key", data.key) 
  ScriptProperties.setProperty("Token", data.token) 
  ScriptProperties.setProperty("Dashboard", data.dashboard)
  FillKeyToken(data)
}

function FillKeyToken(data){
  api_key = data.key
  api_token = data.token
  dashboard = data.dashboard
}
// Variables declared to use in custom fields
let isMilestone=strategicProject=initiativeLead=agileFacilitator=statusJustification=cost=memberNameCustom=area=""

let api_key 
let api_token
let dashboard

let url;   
let key_and_token;

