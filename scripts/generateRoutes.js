const fs = require('fs');
const path = require('path');

// Dossier contenant vos pages (ajustez le chemin selon votre projet)
const appDirectory = path.join(process.cwd(), 'src/app');

// Fonction pour lire récursivement les fichiers dans le dossier 'app/'
function getRoutes(dir, baseUrl = '/') {
  const files = fs.readdirSync(dir);
  let routes = [];

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      routes = [...routes, ...getRoutes(fullPath, path.join(baseUrl, file))];
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      const route = baseUrl + file.replace(/\.tsx|\.jsx$/, '');
      if (route.endsWith('/page')) {
        // routes.push(route.replace('/page', '') || '/');
      }
    }
  });

  return routes;
}

// Écrire les routes dans un fichier JSON
const routes = getRoutes(appDirectory);
fs.writeFileSync('routes.json', JSON.stringify(routes, null, 2));




