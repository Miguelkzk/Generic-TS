# Template: ts-node-express-mysql-typeorm-template
Repo tipo plantilla para estructuracion de carpetas y dependencias de proyecto 

Se debe crear un archivo .env en la raiz del proyecto con los atributos:  
**DB_TYPE**= tipo de base de datos; por defecto, ```"postgres"```.\
**DB_URL**= url de la base de datos.\
**PORT**= puerto en el que corre el servidor localmente; por defecto, ```1234```.

Las variables de entorno son cargadas en una clase en config.ts, la cual luego se pasa como argumento a ```AppDataSource``` en data-source.ts.

## Lista de comandos 
1- Instalar/actualizar dependencias: 
```bash
npm i
```
2- Correr el servidor: 
```bash
npm run dev
```
