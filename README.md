## Bienvenido al repositorio de extraccion Trello Google Sheet
Este desarrollo extrae datos desde los tableros de tu cuenta Trello y la muestra en la planilla de calculo de Google.

Este desarrollo utiliza las credenciales de API Trello (Key & Token), con el lenguaje de programacion javascript siendo ejecutado dentro del entorno de desarrollo de Google App Script.



### Presentacion
![Alt text](/../Images_guide/Images_guide/Home%20Trello.png?raw=true)

![Alt text](/../Images_guide/Images_guide/Home%20Dashboard.png?raw=true)

### Ahora, incluye soporte para la extraccion de campos personalizados
![Alt text](/../Images_guide/Images_guide/Custom%20fields/Custom%20fields%20Dashboard.png?raw=true)


![Alt text](/../Images_guide/Images_guide/Custom%20fields/Custom%20filed%20Sheet.png?raw=true)


### Primeros pasos
Para comenzar, primero, debes hacer una copia de la hoja de calculo del siguiente `<link>`: [Trello G-Sheet]( https://docs.google.com/spreadsheets/d/1o-nKx_6y-E0C9cCkjcaz4D7OjH0u3vd7qbsrkDOtb9s/edit?usp=sharing).  como se muestra acontinuacion:

![Alt text](/../Images_guide/Images_guide/0%20-%20Starting%20with%20Trello/Make%20a%20copy.png?raw=true)


Despues de realizar la copia, debes otorgarle permisos al script para ejecutarse, siguiendo las instrucciones del siguiente video:

[![Watch the video](https://drive.google.com/uc?export=view&id=17br46Mh5t74vHkpNhBjq_z7PkAznZNag)](https://drive.google.com/file/d/1kVLpnNUcOzXMxdfE90zXgCBfNxIUKby-/preview)

### Ingresando credenciales de Trello al formulario

Para continuar con este paso, debes estar logueado con tu cuenta en Trello. Y acontinuacion, seguir los siguientes instruciones:
##### 1
![Alt text](/../Images_guide/Images_guide/1%20-%20Credentials/5.png?raw=true)
##### 2
![Alt text](/../Images_guide/Images_guide/1%20-%20Credentials/6.png?raw=true)
##### 3
![Alt text](/../Images_guide/Images_guide/1%20-%20Credentials/7.png?raw=true)
##### 4
![Alt text](/../Images_guide/Images_guide/1%20-%20Credentials/8.png?raw=true)
##### 5
![Alt text](/../Images_guide/Images_guide/1%20-%20Credentials/9.png?raw=true)
##### 6
![Alt text](/../Images_guide/Images_guide/1%20-%20Credentials/10.png?raw=true)
##### 7
![Alt text](/../Images_guide/Images_guide/1%20-%20Credentials/11.png?raw=true)

Ahora puedes hacer click sobre el boton 'Run' para comenzar a ejecutar el script. 
Si todo esta correcto, el script debera crear una nueva hoja de calculo con la informacion  de tu(s) tablero(s)

## Automatizacion de Extraccion

Si deseas que la informacion se extraiga automaticamente, sin tener que presionar el boton "Run". Entonces, deberas seguir las siguientes instrucciones:

###### 1
![Alt text](/../Images_guide/Images_guide/2%20-%20Automatization/1.png?raw=true)
###### 2
![Alt text](/../Images_guide/Images_guide/2%20-%20Automatization/2.png?raw=true)
###### 3
![Alt text](/../Images_guide/Images_guide/2%20-%20Automatization/3.png?raw=true)
###### 4
Debes seleccionar los mismos campos que se muestran acontinuacion:
![Alt text](/../Images_guide/Images_guide/2%20-%20Automatization/4.png?raw=true)

Por ejemplo: Segun la imagen anterior, el script, se ejecutara todos los dias entre las 8 y 9 pm. Puedes cambiar la hora de ejecucion segun tus gustos o preferencias.
Tambien, puedes ser notificado en caso de que la extraccion falle. Para eso, debes habilitar la opcion "Failure notification settings": inmediatemente, cada hora, cada dia o semanalmente. (esta notificacion llegara via Gmail)
Finalmente presionas el boton guardar.

###### 5
![Alt text](/../Images_guide/Images_guide/2%20-%20Automatization/5.png?raw=true)

Se ha guardado correctamente la programacion de ejecucion del script. Recuerda que puedes seguir agregando mas horarios de ejecucion presionando el boton "Add Trigger"

Felicidades! Ahora el script esta listo para ejecutarse automaticamente segun tu programacion. 



