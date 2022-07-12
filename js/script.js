//Zmienne przechowujące dane o książkach, przefiltrowane dane, informację czy następne sortowanie ma być malejące oraz obiekt DOM odnoszący się do zawartości tabeli
var fullData,filteredData,desc = [],tbody=document.getElementById("ksiazki");

//Filtrowanie danych ze zmiennej fullData, wynik jest zapisywany w zmiennej filteredData
function filterDataByKey(key,filter){
	filter = filter.toUpperCase();
	tempData = [];
	for(let i=0;i<fullData.length;i++){
		if(fullData[i][key].toUpperCase().indexOf(filter)>-1){
			tempData.push(fullData[i]);
		}
		
	}
	filteredData = tempData;
}

/*Sortowanie danych. Atrybut number określa czy sortowane dane są numerami, 
key określa klucz według którego dane będą sortowane, desc określa czy sortowanie będzie malejące czy rosnące
*/
function sortDataByKey(number,key,desc){
	if(number){
		fullData.sort(function(a, b) {
			if(desc){
		    	return b[key]-a[key];
		    }else{
		    	return a[key]-b[key];	        
		    }
		});
	}else{
	    fullData.sort(function(a, b) {
	        if(desc){
	            return a[key] > b[key]? -1:1;
	        }else{
	            return a[key] > b[key]? 1:-1;
	        }  
	    });
	}
}

//Wypełnianie tabeli danymi
function fillTable(data){
	for(let i=0;i<data.length;i++){
		let tr = document.createElement("tr");
		let row = Object.values(data[i]);

		for(let j=0;j<row.length;j++){
			tr.innerHTML += '<td>'+row[j]+'</td>';
		}
		tbody.appendChild(tr);
	}
	
}

//Opróżnianie tabeli
function emptyTable(){
	tbody.innerHTML = "";
}

//Sortuje tabelę i odświeża w niej dane. Po każdym wywołaniu funkcji zmienia się tryb sortowania na malejący/rosnący.
function sortTable(number,column){
	if(typeof desc[column] == "undefined"){
		desc[column] = false;
	}
	sortDataByKey(number,column,desc[column]);
	desc[column] = !desc[column];
	emptyTable();
	fillTable(fullData);
}

//Pobiera tekst z określonego pola i według niego filtruje dane w tabeli
function filterTable(column){
	let data = fullData;
	filter = document.getElementById("table-"+column).value;
	if(filter != ""){
		filterDataByKey(column,filter);
		data = filteredData;
	}

	emptyTable();
	fillTable(data);
}

//Początkowa inicjalizacja tabeli
function loadTable(json){
	fullData = json;
	fillTable(fullData);
}

//Skrypt należy uruchamiać z serwera żeby ksiazki.json był pobierany przez HTTP
fetch("data/ksiazki.json")
  .then(response => response.json())
  .then(json => loadTable(json));

