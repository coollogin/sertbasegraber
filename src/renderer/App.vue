<template>
  <div id="app">
      <header >
      <div class="row">
        <!--h1>Росаккредитация</h1-->
        <img id="logo" src="..\..\build\logo.svg" alt="лого">
        <div class="line">

        </div>
        <h4>выгрузка данных</h4>
      </div>
    </header>

    <div id="main">

        

      <div class="row start">

          <div v-if="!isProgress &&!viewNow">

            <form>
              <div class="">
                <input placeholder="Код ОС" class="datepicker" id="codeOS" value="" v-model="codeOS">
              </div>
            </form>

            <div class="btn" @click.prevent="startFindLinks">Старт</div>

          </div>
      </div>

      <br>

      <div class="row">
          <div class="col s6">
            <div  class="btn" @click="mySaveToExcell()">Сохранить в Excel</div>
            <!-- v-if="!isProgress && viewNow"  -->
            <!--div v-if="!isProgress && viewNow" class="btn" @click="exportTableToExcel('datatable', 'myfile')">Сохранить в Excel</div-->
            <!--div v-if="viewNow" class="btn" @click="mySaveToExcell(this, 'datatable')">Coll в Excel</div-->
          </div>

          <div class="col s6">
            <div v-if="isProgress || viewNow" class="btn red" @click="clearApp()">Отмена задания</div>
          </div>
      </div>
      <div class="row">
          <div class="col s6">
            <div v-if="!isProgress && viewNow && status!='Сбор данных завершен' " class="btn" @click="startFindPhones()" >Дополнить телефонами</div>
          </div>
      </div>

    </div>



  <transition name="slide-fade">
      <div class="info" v-if="totalItems !=''">{{totalItems}} записей,&nbsp;&nbsp;&nbsp;&nbsp; Код ОС:  {{codeOS}},&nbsp;&nbsp;&nbsp;&nbsp; Всего страниц: {{totalPages}}</div>
  </transition>

  <footer>
    <div class="status col s10" >Статус: <span> {{status}} </span> </div>

    <div class="progress" v-if="isProgress">
      <div class="indeterminate"></div>
    </div>


  </footer>
  </div>
</template>

<script>
// <table id="datatable">
//    <tr>
//        <td>Статус</td> <td>Номер сертификата</td> <td>Ссылка</td> <td>Выдан</td> <td>Действителен до</td> <td>Заявитель</td> <td>Изготовитель</td> <td>Продукция</td> <td>Телефон</td> <td>Email</td>
//    </tr>
//    <tr v-for="item in certs">
//        <td>{{item.status}}</td> <td>{{item.certNumber}}</td> <td>{{item.certLink}}</td> <td>{{item.from}}</td> <td>{{item.to}}</td> <td>{{item.applicant}}</td> <td>{{item.factory}}</td> <td>{{item.product}}</td> <td>{{item.phone}}</td> <td>{{item.email}}</td>
//    </tr>
//  </table>
/*  */
/* eslint-disable */
  //import LandingPage from '@/components/LandingPage'
  import 'materialize-css/dist/js/materialize.min'
  //import ExcellentExport from 'excellentexport';
  //import 'nightmare'
  //import 'file-saverjs'
  import saveAs from 'file-saver'
  //import TableExport from 'tableexport'



  let Nightmare = require('nightmare');
  //const electronPath = require('electron/../electron');
  const defaultOptions = {
    electronPath: require('electron/../electron'),
    waitTimeout: 60000,
    height: 1080,
    wight: 1920,
    show: false
  };


  export default {
    name: 'sertbasegraber',
    components: {
      //Nightmare
      //ExcellentExport
      //LandingPage
    },
    data () {
      return {
          ni: 1,
          codeOS: 'АЯ46',
          totalItems: '',
          totalPages: 0,
          certs: [  {status: "Статуc", certNumber: "Номер сертификата", certLink: "Ссылка", from: "Выдан", to: "Действителен до", applicant: "Заявитель", factory: "Изготовитель", product: "Продукция"}],
          isProgress: false,
          status: 'Ожидаю запуска',
          viewNow: false,
          clearAppStatus: false
      }
    },
    methods:{
      clearApp(){
          this.clearAppStatus = true;
          this.totalItems = '';
          this.n = 1;
          this.totalPages = 0;
          this.certs = '';
          this.isProgress = false;
          this.viewNow = false;
          this.status = 'Ожидаю запуска';

      },
      mySaveToExcell(){
        let delimiter = ';';
        let EOL = '\r\n';
        let data = this.certs;
        //<td>Статус</td> <td>Номер сертификата</td> <td>Ссылка</td> <td>Выдан</td> <td>Действителен до</td> <td>Заявитель</td> <td>Изготовитель</td> <td>Продукция</td>
        let rows = data.map( function(el){
          return [el.status , el.certNumber, el.certLink, el.from, el.to, el.applicant, el.factory, el.product]
          .join(delimiter) + EOL
        });

        saveAs( new Blob(['\ufeff' + rows], {type: 'text/csv; charset=utf-8'}), 'data.csv' );

      },
      TableExportToFile(tableID, name, fileName){
        alert('Hi!');
        TableExport(document.getElementsByTagName(tableID), {filename: fileName, sheetname: name});

      },
      exportTableToExcel(tableID, filename = ''){
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

        // Specify file name
        filename = filename?filename+'.xls':'excel_data.xls';

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if(navigator.msSaveOrOpenBlob){
            var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob( blob, filename);
        }else{
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + this.certs; //+ tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
  },

      startFindLinks(){
        if(this.codeOS == ''){
          alert('Укажите, пожалуйста, код Органа по сертификации!');
          return;
        }
        this.isProgress = true;
        this.clearAppStatus = false;
        this.status = "Подкючаюсь к реестру";

        let temp = this;
        (async () => {
          let nightmare = Nightmare(defaultOptions);
          //this.status = "Подкючаюсь 2 к реестру";
          try {
            await nightmare
              //.screenshot('pic'+'start'+'.png')
              .goto('https://pub.fsa.gov.ru/rss/certificate')
              .wait(500)
              //.screenshot('pic'+'loaded'+'.png')
              .wait('.advanced-search__footer button')
              .wait(500)
              //.screenshot('pic'+'loaded2'+'.png')
              .click('.advanced-search__footer button')
              .wait(500)
              //.screenshot('pic'+'click'+'.png')
              .wait('img.ng-star-inserted')
              //.screenshot('pic'+'type'+'.png')
              .wait(500)
              .type('input[_ngcontent-c39]', temp.codeOS)
              .click('div[_ngcontent-c39].search-cell .column-search-panel__icon_search');

              temp.status = "Ищу подходящие записи";

            //Изменяем масштаб страницы
            await nightmare.evaluate(() => {document.body.style.zoom = "50%";});

            await nightmare
              .wait(1000)
              .wait('div[hidden].waiter')
              .wait(10000);




            // Сбор ссылок и предварительных данных
            let siteData = await nightmare.evaluate(() => {


              //$("body").css({ zoom: 0.5, transform: "scale(0.5)", transformOrigin: "0 0" })

              let elems = document.querySelectorAll('.table-view-body__container tbody tr');
              let values = [].map.call(elems, function(obj) {

                let s = 'none';
                let n = obj.querySelector('td:nth-child(3)').textContent;
                let link = obj.querySelector('td:nth-child(3) .h-table-cell-link-wrapper').href;
                let validFrom = obj.querySelector('td:nth-child(4)').textContent;
                let validTo = obj.querySelector('td:nth-child(5)').textContent;
                let z = obj.querySelector('td:nth-child(6)').textContent;
                let f = obj.querySelector('td:nth-child(7)').textContent;
                let p = obj.querySelector('td:nth-child(8)').textContent;
                if(n != '' && z != '')return {status: s, certNumber: n, certLink: link, from: validFrom, to: validTo, applicant: z, factory: f, product: p};
              });
              //Отфильтровка пустых элементов
              let valuesFilterd = values.filter(function (el) {
                return el != null;
              });
              //Общее количество записей
              let i = document.querySelector('.pages-data div:nth-child(2)').textContent;
              //Число страниц
              let p1 = document.querySelector('.show-pagination span:nth-child(3)').textContent;
              let p2 = p1.replace('из','');
              let p3 = p2.replace(/\s/g, '');
              let p = + p3;

              let data1page = {totalItems: i, certs: valuesFilterd, totalPages: p };

              return data1page;
            }); // end Evaluate

            //Дополнение основного массива записей
            Array.prototype.push.apply(temp.certs, siteData.certs);
            // Вывод информации о записях
            temp.totalItems = siteData.totalItems;
            // Вывод количества страниц
            temp.totalPages = siteData.totalPages;

            //siteData.totalPages
            for (let k = 2; k <= temp.totalPages; k++){ //temp.totalPages
            this.status = "Обработка "+ k + " страницы. Собрано " + temp.certs.length + " сертификатов";

            await nightmare
              .wait(1000)
              .click('.paginations__page-toogle_right')
              .wait(1000)
              .wait('div[hidden].waiter')
              .wait(1000);

              // Сбор ссылок и предварительных данных
              siteData =  await nightmare.evaluate(() => {

              let elems = document.querySelectorAll('.table-view-body__container tbody tr');
              let values = [].map.call(elems, function(obj) {

                let s = 'none';
                let n = obj.querySelector('td:nth-child(3)').textContent;
                let link = obj.querySelector('td:nth-child(3) .h-table-cell-link-wrapper').href;
                let validFrom = obj.querySelector('td:nth-child(4)').textContent;
                let validTo = obj.querySelector('td:nth-child(5)').textContent;
                let z = obj.querySelector('td:nth-child(6)').textContent;
                let f = obj.querySelector('td:nth-child(7)').textContent;
                let p = obj.querySelector('td:nth-child(8)').textContent;

                if(n != '' && z != '') {
                  return {status: s, certNumber: n, certLink: link, from: validFrom, to: validTo, applicant: z, factory: f, product: p};
                }

              });

              // Отфильтровка пустых элементов
              let valuesFilterd = values.filter(function (el) {
                return el != null;
              });

              return valuesFilterd;

            });

              if (siteData != undefined) {
                Array.prototype.push.apply(temp.certs, siteData);
              }
            } //end for

              // ----------------------------------------------------------------------
              //alert('Сбор данных успешно завершен.')
              // ----------------------------------------------------------------------

          }catch (error) {
            console.error('Search failed:', error);
            temp.status = "Ошибка!";
            //temp.clearApp();
            alert('Что-то пошло не так. Попробуйте еще раз.');
          }finally {
            await nightmare.end();
            this.isProgress = false;
            if(!this.clearAppStatus) {
              this.status = "Выполнено";
              this.viewNow = true;
            }

          }
        })()
      },
    startFindPhones(){
      this.clearAppStatus = false;
      this.isProgress = true;
      let temp = this;
      temp.isProgress = true;
      //temp.certs = [{num: 1, certLink:'https://pub.fsa.gov.ru/rss/certificate/view/2518499', phone: '111' },{num: 2, certLink:'https://pub.fsa.gov.ru/rss/certificate/view/2518338', phone: '222' },{num: 3, certLink: 'https://pub.fsa.gov.ru/rss/certificate/view/2518271', phone: '333' }];

        //---------------------------------------------------------------------------------------------
        (async () => {
          for (let i = 0; i < temp.certs.length; i++) {
            //alert(temp.certs[i].certLink);
            let itemNow = i + 1;
            temp.status = "Поиск доп. информации для "+ itemNow +" записи из " + temp.certs.length;

          let nightmare = Nightmare(defaultOptions);
          try{

            await nightmare
              .goto(temp.certs[i].certLink)
               .wait(1000)
               .wait('.card-links-list')
               .wait(1000)
               .click('.card-links-list ul li:nth-child(3) a')
               .wait(1000)
               .wait('.card-view__container__block .card-edit-row__content');

            // Сбор ссылок и предварительных данных
            let siteData = await nightmare.evaluate(() => {
                let phoneEndEmail = document.querySelectorAll('.card-block__container__content  fgis-card-block .item');
                let statusCert = document.querySelector('fgis-toolbar-status .status').textContent;
                let result = {status: statusCert, email: phoneEndEmail[phoneEndEmail.length-1].textContent, phone: phoneEndEmail[phoneEndEmail.length-2].textContent};
              return result;
            });

            temp.certs[i].status = siteData.status;
            temp.certs[i].phone = siteData.phone;
            temp.certs[i].email = siteData.email;

          }catch (error) {
            console.error('Search failed:', error);

            //alert('Что-то пошло не так. Попробуйте еще раз.');
          }finally {
            await nightmare.end();

          }


        }//end for

        this.isProgress = false;
        if(!this.clearAppStatus) {
          this.status = "Сбор данных завершен";
          this.viewNow = true;
        }

      })() //end async
        //---------------------------------------------------------------------------------------------

        //this.isProgress = false;
      }
    },
    mounted(){
      this.ni = this.ni + 1;
    }
  }
</script>

<style>
 body{
   margin: 0;
   padding: 0;
  }
  #app{
  padding: 0;
  margin: 0;
  }
  h1{
    @import url('https://fonts.googleapis.com/css?family=Roboto:900i');
    font-family: Roboto,sans-serif !important;
    font-weight: 999 !important;
    font-style: italic !important;
    font-size: 48px !important;
    line-height: 6px !important;

  }
  h4{
    text-align: right;
    padding-right: 8px !important;
    font-size: 10px !important;
    letter-spacing: 4px !important;
    line-height: 8px !important;
    margin-top: 0 !important;
    padding-top: 0;
  }

  #logo{
    height: 80px;
    width: auto;
    margin: 20px 5px 0;
  }

  input{
    width: 200px !important;
    border: solid 1px #ddd !important;
    text-align: center;
  }

  .btn{
    background-color: #18b0c9 !important;
    color: #000 !important;
  }
  .btn:hover{
    background-color: #009bc3 !important;
  }

  .btn.red{
    color: #fff !important;
    background-color: #cc0000 !important;
  }
  .btn.red:hover{
    background-color: #990000 !important;
  }


  footer{
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;

    margin: 0;
    padding: 0;
  }
  .progress{
    margin: 0 !important;
    padding: 0 !important;
  }

  .status{
    padding: 12px 15px 12px;
    background-color: #f5f8fa;
    font-size: 14px;
    font-weight: bold;
  }

  .status span{
    color: #18b0c9;
    font-weight: normal;
    padding-left: 10px;
  }

  #datatable{
    display: none
  }

  .line{
    width: 100%;
    height: 1px;
    margin-top: 10px;
    padding: 0;
    border-bottom: solid 1px #777;
  }

  .start{
    text-align: center;
    margin: 0 auto;
  }

  .info{
    position: absolute;
    bottom: 50px;
    left: 0;
    width: 100%;
    padding: 0 15px;
    font-weight: bold;
  }


.slide-fade-enter-active, .slide-fade-leave-active{
   transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateY(10px);
  opacity: 0;
}
</style>
