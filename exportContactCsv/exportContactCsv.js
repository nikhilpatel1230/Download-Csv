import { LightningElement,track,wire } from 'lwc';
import getCon from '@salesforce/apex/getContatcsForCsv.getCon';
const columns = [
    {label:'Contact Id', fieldName:'Id'},
    {label:'FirstName', fieldName:'FirstName'},
    {label:'LastName', fieldName:'LastName'},
    {label:'Phone', fieldName:'Phone'},
];
export default class ExportContactCsv extends LightningElement {

    columns = columns;
    @track data = [];

    @wire(getCon)
    wiredContacts({data,error}){
        if(data){
            this.data = data;
        }
        else if(error){
            console.error(error);
        }
    }

    get checkRecord() {
        return this.data.length > 0 ? false : true; 
    }

    csvHandler() {
        let selectedRows = [];
        let downloadRecords = [];
        selectedRows = this.template.querySelector("lightning-datatable").getSelectedRows()
        if(selectedRows.length > 0) {
            downloadRecords = [...selectedRows];
        } else {
            downloadRecords = [...this.data];
        }
        let csvFile = this.convertArrayToCsv(downloadRecords)
        this.createLinkForDownload(csvFile);
    }

    convertArrayToCsv(downloadRecords) {
        let csvHeader = Object.keys(downloadRecords[0]).toString() ;
        console.log('header: '+csvHeader);
        let csvBody = downloadRecords.map((currItem) => Object.values(currItem).toString());
        console.log('body: '+csvBody);
        let csvFile = csvHeader + "\n" + csvBody.join("\n");
        return csvFile;
    }

    createLinkForDownload(csvFile) {
        const downLink = document.createElement("a");
        downLink.href = "data:text/csv;charset=utf-8," + encodeURI(csvFile);
        downLink.target = '_blank';
        downLink.download = "Account_Record_Data.csv"
        downLink.click();
    }
}