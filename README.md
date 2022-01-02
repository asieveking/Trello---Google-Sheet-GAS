## Bienvenido al repositorio de extraccion Trello Google Sheet
Este desarrollo extrae datos desde Trello y la muestra en la planilla de calculo de Google.

Este desarrollo utiliza las credenciales de API Trello (Key & Token), con el lenguaje de programacion javascript siendo ejecutado dentro del entorno de desarrollo de Google App Script.

### Presentacion
![image](https://drive.google.com/uc?export=view&id=1mZ5F0DSyKYn3CSNraCJgFnFaMn2Obkad)

![image](https://drive.google.com/uc?export=view&id=1BGVQff2jyvPCHqxTBbG9THcnBCT5vHHK)

## :tw-1f525:  Ahora, incluye soporte para la extraccion de campos personalizados :tw-1f525: 
![image](https://drive.google.com/uc?export=view&id=1bnTCGOdz2z7DOJJYgGKqTAgesaeJiep0)

![image](https://drive.google.com/uc?export=view&id=1Z9eVsrnj1GcYsFG7A1LPQYJfT_eb_WOk)


### Primeros pasos
Para comenzar, primero, debes hacer una copia a la hoja de calculo del siguiente `<link>`: [Trello G-Sheet]( https://docs.google.com/spreadsheets/d/1o-nKx_6y-E0C9cCkjcaz4D7OjH0u3vd7qbsrkDOtb9s/edit?usp=sharing).  como se muestra acontinuacion:

![image](https://drive.google.com/uc?export=view&id=1wza2e27ueTe4vb002iAJEQeTzpo5RG7P)

Despues de realizar la copia, debes otorgarle permisos al script para ejecutarse, siguiendo las instrucciones del siguiente video:

[![Watch the video](https://drive.google.com/uc?export=view&id=17br46Mh5t74vHkpNhBjq_z7PkAznZNag)](https://drive.google.com/file/d/1kVLpnNUcOzXMxdfE90zXgCBfNxIUKby-/preview)

### Ingresando credenciales de Trello al formulario

Para continuar con este paso, primero, debemos asegurarnos de estar logueado en Trello. Y acontinuacion, seguir los siguientes instruciones:
###### 1
![image](https://drive.google.com/uc?export=view&id=1pvF8Nr3vvtwKZMDYRf2hpvX2Q6bMWe4P)
###### 2
![image](https://drive.google.com/uc?export=view&id=1ovzEDxABnEpzu1eJPduVE5Sd7IuPt8Vn)
###### 3
![image](https://drive.google.com/uc?export=view&id=1sHC7-PuOMsCeVD-gcmoNKrhzC3PX7_XZ)
###### 4
![image](https://drive.google.com/uc?export=view&id=1DgQc6BCdUaogBIPfn3nC8Unz7-2P89cd)
###### 5
![image](https://drive.google.com/uc?export=view&id=1JeTF3AIRTHcvYuLh4_QpwCe0WQhEgUjR)
###### 6
![image](https://drive.google.com/uc?export=view&id=17-QQt6gIi5Qc1hf7jGgn0Ai1UkibFjlv)
###### 7
![image](https://drive.google.com/uc?export=view&id=1SPkbt7agMo9nk0fsyOlXnTs1NL82XXyO)

Ahora puedes hacer click sobre el boton 'Run' para comenzar a ejecutar el script. 
Si todo esta correcto, el script debera crear una nueva hoja de calculo con la informacion  de tu(s) tablero(s)

##Automatizacion de Extraccion

Si deseas que la informacion se extraiga automaticamente, sin tener que presionar el boton "Run". Entonces, deberas seguir las siguientes instrucciones:

###### 1
![image](https://drive.google.com/uc?export=view&id=14SktOWvl_RnSBTUvJXCheunr8a0nDSMB)
###### 2
![image](https://drive.google.com/uc?export=view&id=113URZqCsmawD179meBQiGXws6d_g2goh)
###### 3
![image](https://drive.google.com/uc?export=view&id=1MsQ1KiKOqP8qRe9ZzfR8U3B60g_JFJKg)
###### 4
Debes seleccionar los mismos campos que se muestran acontinuacion:
![image](https://drive.google.com/uc?export=view&id=1_dA9PKIPBm_cHaDpUew1d-uFhKiKSPe2)
Por ejemplo: Segun la imagen anterior, el script se ejecutara todos los dias entre las 8 y 9 pm. Puedes cambiar la hora de ejecucion segun tus gustos o preferencias.
Tambien, puedes ser notificado en caso de que la extraccion falle. Para eso, debes habilitar la opcion "Failure notification settings": inmediatemente, cada hora, cada dia o semenalmente. (esta notificacion llegara via Gmail)
Finalmente presionas el boton guardar.
###### 5
![image](https://drive.google.com/uc?export=view&id=1g6J-6Eyeg_Mytrn-oe659luLXe6PLTBl)
Se ha guardado correctamente la programacion de ejecucion del script. Recuerda que puedes seguir agregando mas horarios de ejecucion presionando el boton "Add Trigger"


Felicidades! Ahora el script esta listo para ejecutarse automaticamente segun tu programacion. 



