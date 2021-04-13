# Generative Art Gallery Canvas

Project started inspired by [FRAMED](https://frm.fm/) and the will to learn HTML/CSS/JS, Node.js, Express.js, Electron.js, TypeScript, SASS, p5.js, paper.js, THREE.js...

The goal is to have a Electron app that can load different generative art canvas, developed with Web technics (HTML/CSS/JS, WebGL, HTML Canvas, p5.js, THREE.js, Paper.js...).

The generative art could be started remotly from a list of available arts. Using a web app served by the Electron app. The app should also publish a REST Api for remote control.

Later I plane to build a remote app using Flutter.
And later again migrate REST API to GraphQL.

# Install

Depends on 

* git

* git flow

* git lfs

* nodejs

* npm

Clone the repos and activate LFS.

If lfs is not install install it.

```shell
sudo apt update
sudo apt install -y git-lfs git-flow
```

```shell
git clone https://github.com/constantdupuis/Gagcs.git
git lfs install
git flow init
```

Install nodejs and npm.

```shell
sudo apt install -y nodejs npm
```

Change dir to Gags and run 

```shell
npm install
```

After that Gags remote web ui should be available at [http://localhost:33366](http://localhost:33366).

# Remote Control Web pages

Remote control web interface is exposed on port 33366. 

## Color scheme inspiration

* https://visme.co/blog/website-color-schemes/
* https://digitalsynopsis.com/design/minimal-web-color-palettes-combination-hex-code/

# Resources

## Fonts

* https://fonts.google.com/?selection.family=Gloria+Hallelujah|Indie+Flower|Kaushan+Script|Lobster|Pacifico

## THREE

* https://medium.com/@sharadghimire5551/getting-started-with-three-js-and-electron-js-9ae49b1d3f59

## REST API

* https://florimond.dev/blog/articles/2018/08/restful-api-design-13-best-practices-to-make-your-users-happy/

## WebGL

* https://webglfundamentals.org/
* https://webgl2fundamentals.org/
* https://webglfundamentals.org/webgl/lessons/resources/webgl-state-diagram.html
