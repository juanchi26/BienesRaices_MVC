/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/cambiarDestacado.js":
/*!************************************!*\
  !*** ./src/js/cambiarDestacado.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\n    \n    const cambiarEstadoBotones = document.querySelectorAll(\".destacado\")\n    const token = document.querySelector(\"[name=csrf-token]\").content\n\n   cambiarEstadoBotones.forEach(boton => {\n    boton.addEventListener(\"click\", cambiarDestacado)\n   })\n\n   async function cambiarDestacado (e){\n        const { propiedadId: id } = e.target.dataset\n        const URL = `/propiedades/${id}`\n        try{\n            const respuesta = await fetch(URL, {\n                method: \"PATCH\",\n                headers:{\n                    \"CSRF-Token\" : token,\n                }\n                \n            })\n            const { resultado } = await respuesta.json()\n            \n            if(resultado){\n                if(e.target.classList.contains(\"bg-gray-200\")){\n                    e.target.classList.remove(\"bg-gray-200\", \"text-gray-800\")\n                    e.target.classList.add(\"bg-orange-200\", \"text-orange-800\")\n                    e.target.textContent = \"Destacado\"\n                }else{\n                    e.target.classList.remove(\"bg-orange-200\", \"text-orange-800\")\n                    e.target.classList.add(\"bg-gray-200\", \"text-gray-800\")\n                    e.target.textContent = \"No Destacado\"\n                }\n                \n            }\n        }catch(error){\n            console.log(error)\n        }\n\n\n   }\n\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/cambiarDestacado.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/cambiarDestacado.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;