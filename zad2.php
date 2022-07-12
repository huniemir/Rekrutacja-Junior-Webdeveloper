<?php

class KsiazkaConverter{

	//Stałe zawierające informacje URL pobieranego pliku XML, położenie pliku zapisanego lokalnie na wypadek nieudanego pobierania przez URL a także domyślna ścieżka zapisu przekonwertowanego pliku.
	private const DATAURL = 'https://dlabystrzakow.pl/xml/produkty-dlabystrzakow.xml';
	private const ONERRORDATAPATH = 'data/produkty-dlabystrzakow.xml';
	private const DEFAULTSAVEFILEPATH = 'data/ksiazki.json';

	//Pobranie pliku przez URL lub lokalnie, zapis wybranych elementów do tablicy i jej konwersja do jsona.
	private static function convertKsiazka($dataUrl, $onErrorPath){
		$dataXml = file_get_contents($dataUrl);
		if(!$dataXml){$dataXml = file_get_contents($onErrorPath);}
		if(!$dataXml){return false;}
		$data = simplexml_load_string($dataXml);
		$selectedDataArray = [];
		foreach($data->lista->ksiazka as $ksiazka){		
				$selectedDataArray[] = array(
					"ident" => (string)$ksiazka->ident,
					"tytul" => (string)$ksiazka->xpath("tytul[@language='polski']")[0],
					"liczbastron" => (string)$ksiazka->liczbastron,
					"datawydania" => (string)$ksiazka->datawydania
				);
		}

		$selectedDataJson = json_encode($selectedDataArray);
		if($selectedDataJson == "[]"){$selectedDataJson = false;}
		return $selectedDataJson;
	}

	//Funkcja zapisująca skonwertowanego JSONA do pliku. Do użycia w konsoli. W argumencie należy podać ścieżkę wraz z nazwą i rozszerzeniem pliku.
	public static function saveConvertedKsiazka($path){
		$data = self::convertKsiazka(self::DATAURL,self::ONERRORDATAPATH);
		if(!$data){
			echo "Konwertowanie pliku nie powiodło się";
		}else{
			$saved = file_put_contents($path,$data);
			if($saved){
				echo "Konwertowanie i zapis pliku powiodły się";
			}else{
				echo "Zapis pliku nie powiódł się";
			}
		}
		
	}

	//Funkcja zapisująca JSONA przy użyciu domyślnej ścieżki.
	public static function saveConvertedKsiazkaDefaultPath(){
		self::saveConvertedKsiazka(self::DEFAULTSAVEFILEPATH);
	}

}



