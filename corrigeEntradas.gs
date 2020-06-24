////////////////////////////////////////////////
///// CORRIGE POSSÍVEIS ERROS NO TELEFONE //////
////////////////////////////////////////////////
function correcaoFone(){
  
  var sheet = SpreadsheetApp.getActiveSheet();
  //Verica o escopo de dados
  var dataRange = sheet.getDataRange();
  
  var sheetCorrecao = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CORRIGE");
  var rangeCorrecao = sheetCorrecao.getDataRange();
  
  //Corrige telefones e verifica se errado - Colunas 14 e 15
  
  var und = [729, 730, 731, 732, 734, 735, 736, 737, 738, 740, 741, 742, 744, 745, 746, 747, 748, 749, 750, 752, 753, 754, 756, 757, 760, 763, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 775, 776, 778, 779, 782, 783, 784, 785, 787, 788, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 826, 827, 828, 829, 831, 832, 833, 834, 835, 836, 838, 840, 841, 842, 843, 844, 845, 846, 848, 849, 850, 851, 852, 854, 855, 861, 863, 864, 865, 866, 868, 869];
  var column = 14;
  var lastRow = dataRange.getLastRow();
  for (var rows in und){
    var row = und[rows];
    var theirPhone1 = dataRange.getCell(row,column).getValue().toString();
    var theirPhone2 = dataRange.getCell(row,column+1).getValue().toString();
    
    //adiciona telefone
    if (theirPhone1) {
      
      if (theirPhone1 == "undefined") {
        
        
        var emailAddress = dataRange.getCell(row,13).getValue().toString();
        var contato = ContactsApp.getContact(emailAddress);
        
        
        var newTheirPhone1 = rangeCorrecao.getCell(row+14,column+2).getValue().toString();
        theirPhone1 = formatarFone(newTheirPhone1);
        dataRange.getCell(row,column).setValue(theirPhone1);
        
        var telefones = contato.getPhones();
        
        for(var tf in telefones) {
          
          telefones[tf].deletePhoneField();
          
        }
        
        var telefones2 = contato.getPhones();
        
        
        if (parseInt(theirPhone1.charAt(3)) > 4 || parseInt(theirPhone1.charAt(2)) == 9){          //é celular?
          var cont = contato.addPhone(ContactsApp.Field.MOBILE_PHONE, theirPhone1);
          var ccc = cont.getPhoneNumber();
        } else {                                                       
          contato.addPhone(ContactsApp.Field.HOME_PHONE, theirPhone1);
        }
        var bbb = 3;
      }
    }
    if (theirPhone2) {
      if (theirPhone2 == "undefined") {
        
        
        var emailAddress = dataRange.getCell(row,13).getValue().toString();
        var contato = ContactsApp.getContact(emailAddress);
        
        
        var newTheirPhone2 = rangeCorrecao.getCell(row+14,column+2+1).getValue().toString();
        theirPhone2 = formatarFone(newTheirPhone2);
        dataRange.getCell(row,column+1).setValue(theirPhone2);
        
        if (parseInt(theirPhone2.charAt(3)) > 4 || parseInt(theirPhone2.charAt(2)) == 9){          //é celular?
          contato.addPhone(ContactsApp.Field.MOBILE_PHONE, theirPhone2);
        } else {                                                       
          contato.addPhone(ContactsApp.Field.HOME_PHONE, theirPhone2);
        }
      }
    }
    var aaaaa = 1;
  }
}

///////////////////////////////////////////////////////
///// REMOVE CARACTER EM BRANCO AO FINAL DO NOME //////
///////////////////////////////////////////////////////

function removeLastBlank (str) {
  if (str.substring(str.length-1) != " ")
    return str;
  else
    return removeLastBlank(str.substring(0, str.length-1));
}

////////////////////////////////////////////////////////
///// REMOVE CARACTER EM BRANCO AO INÍCIO DO NOME //////
////////////////////////////////////////////////////////

function removeFirstBlank (str) {
  if (str.substring(0,1) != " ")
    return str;
  else
    return removeFirstBlank(str.substring(1, str.length));
}

////////////////////////////////////////////////////
///// LETRAS EM MAIÚSCULO, EXCETO PREPOSIÇÕES //////
////////////////////////////////////////////////////

function capitaliseFirstLetter(str) {
  //Transforma todas as palavras em primeira letra maiúscula e o resto minúscula  
  var strtmp = str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  //Transforma os pronomes da, das, do, dos, de e e em minúsculo
  strtmp = strtmp.replace("Da ", "da ");
  strtmp = strtmp.replace("Das ", "das ");
  strtmp = strtmp.replace("Do ", "do ");
  strtmp = strtmp.replace("Dos ", "dos ");
  strtmp = strtmp.replace("De ", "de ");
  strtmp = strtmp.replace("E ", "e ");
  strtmp = removeLastBlank (strtmp);
  strtmp = removeFirstBlank (strtmp);
  //retorna valor
  return strtmp;
}

/////////////////////////////////////////
///// COLOCA O TELEFONE NO FORMATO //////
/////////////////////////////////////////

function formatarFone(foneentrada) {
  //Coloca os telefones no formato XX XXXX XXXX ou XX XXXXX XXXX (para DDD 11)
  var fone = foneentrada.replace(/[^\d]+/g,'');

  if (fone.length > 10) {
    if (fone.substring(0,2) == "55") {
      fone = fone.substring(2,fone.length);
    }
    if (fone.substring(0,1) == "0") {
      fone = fone.substring(1,fone.length);
    }
    return fone.substring(0,fone.length-8) + " " + fone.substring(fone.length-8,fone.length-4) + " " + fone.substring(fone.length-4);

  } else if (fone.length == 10) {
    return fone.substring(0,fone.length-8) + " " + fone.substring(fone.length-8,fone.length-4) + " " + fone.substring(fone.length-4);
  } else if (fone.length == 8) {
    return "XX " + fone.substring(0,fone.length-4) + " " + fone.substring(fone.length-4);
  } else if (fone.length == 0) {
    return "";
  } else {
    return "Telefone pendente: " + foneentrada;
  }
}

/////////////////////////////
///// VALIDAÇÃO DE CEP //////
/////////////////////////////

function validarCEP(CEP) {
  //Verifica se o CEP tem 8 dígitos e coloca no formato XX.XXX-XX
  CEP = CEP.replace(/[^\d]+/g,'');

  if (CEP.length != 8) {
    return "CEP pendente";
    } else {
    return CEP.substring(0,2) + "." + CEP.substring(2,5) + "-" + CEP.substring(5);
    }
}

///////////////////////////
///// FORMATAÇÃO CPF //////
///////////////////////////

function formatarCPF(cpf) {
  //Coloca o CPF no formato XXX.XXX.XXX-XX
  cpf = cpf.replace(/[^\d]+/g,'');
  
  if (cpf.length < 11) {
    for (i=0; i <= (11 - cpf.length); i++) {
      cpf = "0".concat(cpf);
    }
  }
  
  return cpf.substring(0,3) + "." + cpf.substring(3,6) + "." + cpf.substring(6,9) + "-" + cpf.substring(9);
}

///////////////////////
///// VALIDA CPF //////
///////////////////////

function validarCPF(cpf) {
  //Verifica se o CPF é válido
  cpf = cpf.replace(/[^\d]+/g,'');

  if (cpf.length != 11 ||
      cpf == "00000000000" || 
      cpf == "11111111111" || 
      cpf == "22222222222" || 
      cpf == "33333333333" || 
      cpf == "44444444444" || 
      cpf == "55555555555" || 
      cpf == "66666666666" || 
      cpf == "77777777777" || 
      cpf == "88888888888" || 
      cpf == "99999999999")
      return false;
          
    // Valida 1o digito
    add = 0;
    for (i=0; i < 9; i ++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
     
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i ++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
         
    return true;    
}

/**
* @author Rudiney
*
* Creating enum from ContactsApp.Month list
*/
function monthsToEnum(){
  
  var months = ContactsApp.Month;
  
  const monthsEnum = {
    1: months.JANUARY,
    2: months.FEBRUARY,
    3: months.MARCH,
    4: months.APRIL,
    5: months.MAY,
    6: months.JUNE,
    7: months.JULY,
    8: months.AUGUST,
    9: months.SEPTEMBER,
    10: months.OCTOBER,
    11: months.NOVEMBER,
    12: months.DECEMBER
  };
  
  return monthsEnum;
}

/**
* @author Rudiney
*
* Get birthday month from birthday
*
* param birthday: Needs to be a Date type
*/
function getBirthdayMonth(birthday){
  var month = birthday.getMonth();
  var monthsEnum = monthsToEnum();
  var birthdayMonth = monthsEnum[month+1];
  
  return birthdayMonth;
}

/**
* @author Rudiney
*
* See e-mail's list group programatically
*
* After executing this function, go to menu 'View > Logs'
*/
function listContactGroup(){
  var groups = ContactsApp.getContactGroups();
  
  for(var index in groups){
     Logger.log(groups[index].getName());
  }
}

///////////////////////////////////////////
///// FUNÇÃO PRINCIPAL, MAL DESCRITA //////
///////////////////////////////////////////
function corrigeEntradas(e) {
  try {
    //Faz as correções na tabela de cadastro de sócios e os cadastra no contatos
    //Chama o email de boas vindas em caso de CPF válido e manda aviso caso de inválido
    //Avisa à Coordenação Geral sobre o novo cadastro e suas pendências
    
    //Pega a planilha atual
    var sheet = SpreadsheetApp.getActiveSheet();
    //Verica o escopo de dados
    var dataRange = sheet.getDataRange();
    //Pega a última linha
    //Find the number of rows - the index of the last row will be 1 less than this as
    // the numbering system is 0 based i.e. the first row and first column in the sheet 
    // have an index of 0
    var lastRow = sheet.getLastRow();
    //lastRow -= 1;
    //Variável que correrá todas as colunas
    var column;
    
    //Pega o nome da pessoa e corrige colocando na célula (Coluna 2)
    column = 2;
    //Corrige o nome na célula
    //capitaliseFirstLetter(dataRange.getCell(lastRow,column).getValue())
    var correctedName = capitaliseFirstLetter(dataRange.getCell(lastRow,column).getValue());
    var nameCell = dataRange.getCell(lastRow,column).setValue(correctedName);
    //Atualiza o valor na variável
    var theirName = nameCell.getValue();
    //Divide os diversos nomes
    var names = theirName.split(' ');
    //Atribui o primeiro nome ao givenName e o último ao familyName
    var givenName = names[0];
    var familyName = names[names.length-1];
    ///////////////////////////////////////////////////////////
    //ADICIONAR VERIFICAÇÃO DE PRIMEIRO E ÚLTIMO NOMES VAZIOS//
    ///////////////////////////////////////////////////////////
    
    //Pega a data de nascimento - Coluna 3
    column = 3;
    var nascimento = new Date(dataRange.getCell(lastRow,column).getValue());
    
    //Pega a Naturalidade da pessoa e corrige colocando na célula (Coluna 4)
    column = 4;
    dataRange.getCell(lastRow,column).setValue(capitaliseFirstLetter(dataRange.getCell(lastRow,column).getValue().toString()));
    //Atualiza o valor na variável
    var naturalidade = dataRange.getCell(lastRow,column).getValue();  
    
    //Pega o gênero - Coluna 5
    column = 5;
    var sexo = dataRange.getCell(lastRow,column).getValue();
    
    //Pega a Identidade da pessoa e corrige colocando na célula (Coluna 6)
    column = 6;
    dataRange.getCell(lastRow,column).setValue(dataRange.getCell(lastRow,column).getValue().toString().toLowerCase().toUpperCase());
    //Atualiza o valor na variável
    var identidade = dataRange.getCell(lastRow,column).getValue();
    
    //Pega o CPF da pessoa e corrige colocando na célula (Coluna 7)
    column = 7;
    var CPFentrada = dataRange.getCell(lastRow,column).getValue().toString();
    var theirCPF = formatarCPF(CPFentrada);
    //Varivável booleana que verifica se é válido o CPF
    var CPFvalido = validarCPF(theirCPF);
    if (CPFvalido) { // é válido
      //Muda o valor da célula
      dataRange.getCell(lastRow,column).setValue(theirCPF);
      //Atualiza o valor na variável
      theirCPF = dataRange.getCell(lastRow,column).getValue();
    } else {         // não é válido
      //Coloca a associação como pendente
      dataRange.getCell(lastRow,column).setValue("Associação pendente");
    }
    
    //Corrige o endereço e coloca na célula (Colunas de 8 a 11)
    //Endereço - Coluna 8
    column = 8;
    dataRange.getCell(lastRow,column).setValue(capitaliseFirstLetter(dataRange.getCell(lastRow,column).getValue().toString()));
    //Bairro - Coluna 9
    dataRange.getCell(lastRow,column+1).setValue(capitaliseFirstLetter(dataRange.getCell(lastRow,column+1).getValue().toString()));  
    //Cidade - Coluna 10
    dataRange.getCell(lastRow,column+2).setValue(capitaliseFirstLetter(dataRange.getCell(lastRow,column+2).getValue().toString()));
    
    //Cria um string único com o endereço completo
    var address = dataRange.getCell(lastRow,column).getValue() + ", " +    //endereço 
      dataRange.getCell(lastRow,column+1).getValue() + ", " +    //bairro
        dataRange.getCell(lastRow,column+2).getValue() + " - " +   //cidade
          dataRange.getCell(lastRow,column+3).getValue();            //estado
    
    //Corrige o CEP e coloca na célula - Coluna 12
    column = 12;
    dataRange.getCell(lastRow,column).setValue(validarCEP(dataRange.getCell(lastRow,column).getValue().toString()));
    var theirCEP = dataRange.getCell(lastRow,column).getValue();
    
    //Corrige o email, verifica se é válido - Coluna 13
    column = 13;
    //Coloca todo em minúsculo
    var theirMail = dataRange.getCell(lastRow,column).getValue().toString();
    //Verifica se tem @ e pontos nos locais corretos
    var atpos=theirMail.indexOf("@");
    var dotpos=theirMail.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=theirMail.length) {     //Caso não tenha, é inválido
      //Adiciona marca de pendência ao email na célula junto com o email errado
      dataRange.getCell(lastRow,column).setValue("Email pendente: " + theirMail);
      //Envia email à Coordenação Administrativa informando o erro    
    } else {                                                           //Caso tenha, é válido
      //Atualiza a célula se o email estiver correto
      dataRange.getCell(lastRow,column).setValue(theirMail.toLowerCase());
      //Atualiza o valor da variável
      theirMail = dataRange.getCell(lastRow,column).getValue().toString();
    }
    
    //Corrige telefones e verifica se errado - Colunas 14 e 15
    column = 14;
    dataRange.getCell(lastRow,column).setValue(formatarFone(dataRange.getCell(lastRow,column).getValue().toString()));
    var theirPhone1 = dataRange.getCell(lastRow,column).getValue().toString();
    
    column = 15;
    dataRange.getCell(lastRow,column).setValue(formatarFone(dataRange.getCell(lastRow,column).getValue().toString()));
    var theirPhone2 = dataRange.getCell(lastRow,column).getValue().toString();    
    
      ///////////////////////////////////////////   
     ///Cadastra sócio no Contatos do Google ///
    ///////////////////////////////////////////
    // cria contato com nome e nome de família e email
    var contato = ContactsApp.createContact(givenName, familyName, theirMail);
  
    //adiciona nome completo
    contato.setFullName(theirName);  
    
    //adiciona aniversário
    if (nascimento){
      var birthdayMonth = getBirthdayMonth(nascimento);//@Rudiney
      
      contato.addDate(ContactsApp.Field.BIRTHDAY, birthdayMonth, nascimento.getDate(), nascimento.getYear());
    }
    
    //adiciona naturalidade
    contato.addCustomField("Naturalidade", naturalidade);
    
    //adiciona gênero
    if (sexo.charAt(0) == "M") {
      contato.addCustomField(ContactsApp.ExtendedField.GENDER, ContactsApp.Gender.MALE);
    } else if (sexo.charAt(0) == "F") {
      contato.addCustomField(ContactsApp.ExtendedField.GENDER, ContactsApp.Gender.FEMALE);
    }
    
    //adiciona identidade
    contato.addCustomField("Identidade", identidade);
    
    //adiciona CPF
    contato.addCustomField("CPF", theirCPF);
    
    //adiciona endereço
    contato.addAddress(ContactsApp.Field.HOME_ADDRESS, address);
    
    //adiciona CEP
    contato.addCustomField("CEP", theirCEP);
    
    //adiciona telefone
    var textTelefonePendente = "Telefone pendente";
    var isTelefonePendente = theirPhone1 !== undefined && theirPhone1.includes(textTelefonePendente);
    if (!isTelefonePendente) {//@Rudiney
      if (parseInt(theirPhone1.charAt(3)) > 4 || parseInt(theirPhone1.charAt(2)) == 9){          //é celular?
        contato.addPhone(ContactsApp.Field.MOBILE_PHONE, theirPhone1);
      } else {                                                       
        contato.addPhone(ContactsApp.Field.HOME_PHONE, theirPhone1);
      }
    }
    
    isTelefonePendente = theirPhone2 !== undefined && theirPhone2.includes(textTelefonePendente);
    if (!isTelefonePendente) {//@Rudiney
      if (parseInt(theirPhone2.charAt(3)) > 4 || parseInt(theirPhone2.charAt(2)) == 9){          //é celular?
        contato.addPhone(ContactsApp.Field.MOBILE_PHONE, theirPhone2);
      } else {                                                       
        contato.addPhone(ContactsApp.Field.HOME_PHONE, theirPhone2);
      }
    }
    
    //adiciona emprego
    column = 18;
    var emprego = dataRange.getCell(lastRow,column).getValue().toString();
    if (emprego)
      contato.addCustomField("Profissão", emprego);
    
    //adiciona ao grupo Informativo, caso deseje receber informativos por email da Ameciclo
    column = 16
    if (dataRange.getCell(lastRow,column).getValue().toString() != "")
      contato.addToGroup(ContactsApp.getContactGroup("Informativo"));
    
    var aouo = "@";
    if(sexo.charAt(0) == "M")
      aouo = "o";
    else if(sexo.charAt(0) == "F")
      aouo = "a";
    var facebookLogoUrl = "https://sites.google.com/site/condominiomizaelmontenegro/gastos-e-receita/area-do-sindico/Ameciclo_html_m2456de1c.png";
    var twitterLogoUrl = "https://sites.google.com/site/condominiomizaelmontenegro/gastos-e-receita/area-do-sindico/Ameciclo_html_m65ecf6cc.png";
    var instagramLogoUrl = "https://sites.google.com/site/condominiomizaelmontenegro/gastos-e-receita/area-do-sindico/Ameciclo_html_m475d4370.png";
    var facebookUrl = "http://www.facebook.com/AMEciclo";
    var twitterUrl = "http://www.twitter.com/Ameciclo";
    var instagramUrl = "http://www.instagram.com/Ameciclo";
    var amecicloUrl = "http://www.ameciclo.org/";
    var amecicloMailUrl = "mailto:contato@ameciclo.org";
    var amecicloGroupMailUrl = "http://groups.google.com/group/ameciclo";
    var amecicloGroupFacebookUrl = "http://www.facebook.com/groups/138029079711872/";
    
    var facebookLogoBlob = UrlFetchApp.fetch(facebookLogoUrl).getBlob().setName("facebookLogoBlob");
    var twitterLogoBlob = UrlFetchApp.fetch(twitterLogoUrl).getBlob().setName("twitterLogoBlob");
    var instagramLogoBlob = UrlFetchApp.fetch(instagramLogoUrl).getBlob().setName("instagramLogoBlob");  
    
    if (CPFvalido) { //Caso CPF válido
      //Adiciona ao grupo de associados
      contato.addToGroup(ContactsApp.getContactGroup("Associados"));
      contato.addToGroup(ContactsApp.getContactGroup("Associados novos"));

      //Envia email de boas vindas confirmando a inscrição      
      MailApp.sendEmail({
        to: theirMail,
        subject: "Bem vindo à Associação Metropolitana de Ciclistas do Recife",
        htmlBody: 
        "<CENTER><TABLE WIDTH=600 CELLPADDING=4 CELLSPACING=0 RULES=NONE><COL WIDTH=595><TR><TD WIDTH=595 VALIGN=TOP >" +
        "<p>Car"+aouo+" "+givenName+",<br></p>" +
        "<p>>A <b>Ameciclo</b> tem o prazer em tê-l"+aouo+" como associad"+aouo+"!<br></p>" +
        "<p>Visite nossa página na internet: <a href="+amecicloUrl+">www.ameciclo.org</a><br></p>"+
        "<p>Para participar das discussões, você pode entrar no <a href="+amecicloGroupMailUrl+">nosso fórum</a> ou ainda no <a href="+amecicloGroupFacebookUrl+">nosso grupo de associados no Facebook</a>.<br></p>" +              
        "<p>Sinta-se a vontade para participar de nossos Grupos de Trabalho.<br>Será muito bem vind"+aouo+"!<br><br>"+
        "Qualquer dúvida, entre em contato conosco através do e-mail: <a href="+amecicloMailUrl+">contato@ameciclo.org</a><br></p>"+
        "<p ALIGN=CENTER>Atenciosamente,<br><b>AMECICLO<br>Associação Metropolitana de Ciclistas do Recife</b></p></TD></TR>" + 
        "<TR><TD WIDTH=595 VALIGN=TOP><P ALIGN=CENTER>" + 
        "<a href="+ facebookUrl +"><img src='cid:facebookLogo' WIDTH=29 HEIGHT=29></a><a href="+ twitterUrl +"><img src='cid:twitterLogo' WIDTH=29 HEIGHT=29></a><a href="+ instagramUrl +"><img src='cid:instagramLogo' WIDTH=29 HEIGHT=29></a><br></p></TD></TR></TABLE></CENTER>",
        inlineImages:
        {
        facebookLogo: facebookLogoBlob,
        twitterLogo: twitterLogoBlob,
        instagramLogo: instagramLogoBlob
      }
                        });
      //Informa à Coord. Adm do novo associado
      MailApp.sendEmail({
        to: "adm-ameciclo@googlegroups.com",
        subject: "Nov" + aouo + " associad"+aouo + ": " + theirName + " ",
        htmlBody: 
        "Caro Coordenador Administrativo, conferir alguns dados d" + aouo + " associad" + aouo + "<br>" +
        "Nome completo: " + theirName + "<br>" +
        "CPF: " + theirCPF + "<br>" +
        "Identidade: " + identidade + "<br>" +
        "E-mail: " + theirMail + "<br>" +
        "Telefone 1: " + theirPhone1 + "<br>" +
        "Telefone 2: " + theirPhone2 + "<br>" +
        "CEP: " + theirCEP + "<br>"
      });  
      
    } else {         //Caso CPF inválido
      /*@Rudiney
      listContactGroup(); //See account groups menu 'View > Log'
      */
      
      var group = ContactsApp.getContactGroup("Associados pendentes");
      //Adiciona o contato a um grupo de pendência
      contato.addToGroup(group);
      //Envia comunicando pendência para possível cadastrado
      MailApp.sendEmail({
        to: theirMail,
        cco:"adm-ameciclo@googlegroups.com",      //Envia email para a Coord Adm tomar providências
        subject: "Cadastro pendente na Associação Metropolitana de Ciclistas do Recife",
        htmlBody: 
        "<CENTER><TABLE WIDTH=600 CELLPADDING=4 CELLSPACING=0 RULES=NONE><COL WIDTH=595><TR><TD WIDTH=595 VALIGN=TOP >" +
        "<p>Car"+aouo+" "+givenName+",<br></p>" +
        "<p>Infelizmente seu cadastro foi indeferido por erro no CPF informado ("+CPFentrada+").<br><br></p>" +
        "<p>Para prosseguimento do pedido de cadastro, entre em contato conosco no prazo de 30 dias através do e-mail: <p ALIGN=CENTER><a href="+amecicloMailUrl+">ameciclo@gmail.com</a><br></p>"+
        "<p>O não atendimento da solicitação acima implicará o indeferimento do seu pedido de inscrição.<br><br></p>" +
        "<p ALIGN=CENTER>Atenciosamente,<br><b>AMECICLO<br>Associação Metropolitana de Ciclistas do Recife</b></p></TD></TR>" + 
        "<TR><TD WIDTH=595 VALIGN=TOP><P ALIGN=CENTER>" + 
        "Visite nossa página na internet:<br><a href="+amecicloUrl+">www.ameciclo.org</a><br>"+
        "<a href="+ facebookUrl +"><img src='cid:facebookLogo' WIDTH=29 HEIGHT=29></a><a href="+ twitterUrl +"><img src='cid:twitterLogo' WIDTH=29 HEIGHT=29></a><a href="+ instagramUrl +"><img src='cid:instagramLogo' WIDTH=29 HEIGHT=29></a><br></p></TD></TR></TABLE></CENTER>",
        inlineImages:
        {
        facebookLogo: facebookLogoBlob,
        twitterLogo: twitterLogoBlob,
        instagramLogo: instagramLogoBlob
      }
                        });
    }
  } catch(e) {
    // Handle any errors, sending an error message to the recipient
    MailApp.sendEmail("ti-ameciclo@googlegroups.com", "Erro no formulario de INSCRIÇÃO NA AMECICLO, verificar e tratar!", e.message);
  }
}
   
