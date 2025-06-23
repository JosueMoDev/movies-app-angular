# Movie App - Angular

Una aplicación sencilla y moderna para explorar y descubrir películas utilizando la API de TMDB (The Movie Database).

## Funcionalidades

- **Explora películas**: Busca y visualiza información sobre tus películas favoritas.
- **Interfaz interactiva**: Navega a través de una interfaz de usuario elegante construida con Angular y PrimeNG.
- **Diseño responsivo**: Aprovecha el poder de Tailwind CSS para un diseño adaptativo en cualquier dispositivo.

## Tecnologías

- **Angular**: Framework frontend para construir aplicaciones de una sola página (SPA).
- **PrimeNG**: Biblioteca de componentes UI para Angular.
- **TailwindCSS**: Framework de CSS para un diseño flexible y fácil de personalizar.
- **TMDB API**: API de The Movie Database para obtener información sobre películas.

## Creación del Proyecto

Este proyecto fue creado utilizando `vite create` con el siguiente comando:

```bash
npm create vite@latest movies-app-angular --template angular
yarn install
npm install

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
@tailwind base;
@tailwind components;
@tailwind utilities;

yarn add primeng primeicons
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ButtonModule,
    CardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
