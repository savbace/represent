# Dev

## Clients
- https://github.com/rfoel/strava
- https://github.com/gabornemeth/StravaSharp
- https://www.nuget.org/packages/AspNet.Security.OAuth.Strava/8.1.0
- https://github.com/grafana/strava-datasource
- https://github.com/erik/derive

## Resources
- https://developers.google.com/maps/documentation/routes/polylinedecoder
- https://gisgeography.com/latitude-longitude-coordinates/
- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- [How to get the co-ordinates of scaled down polygon](https://math.stackexchange.com/a/125402/457912)
- [Strava API - How to get route image](https://stackoverflow.com/a/53377017/1276058)
- https://github.com/mapbox/polyline
- [React Leaflet with Strava API tutorial](https://www.youtube.com/watch?v=lxrchC0iDHs)
- https://www.npmjs.com/package/leaflet-image
- https://docs.mapbox.com/api/maps/static-images/
- [Plotting Strava data with Python](https://nddoornekamp.medium.com/plotting-strava-data-with-python-7aaf0cf0a9c3)


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
