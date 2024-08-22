# Represent

## Overview
Generate sharable picture of Strava activity.

## Tasks/Ideas
- [x] Select from the latest top N activities
- [x] Select uploaded image from activity.
- [ ] Add different templates of stats representation.
  - Exclude/include stats (pace, date, elev etc).
  - Add emoji.
- [ ] Upload image from file.
- [ ] Use map as a background.
- [ ] Settings: sizes for canvas, polyline, fonts, colors etc.
- [ ] Find a way to minimize [429 Too Many Requests](https://developers.strava.com/docs/rate-limits/).
- [x] Copy/save image. Workaround: Right-click -> Copy Image. ISSUE: https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
- [ ] Migrate auth to [OpenIddict](https://github.com/aspnet-contrib/AspNet.Security.OAuth.Providers?tab=readme-ov-file#migrating-to-openiddict).

## API
https://developers.strava.com/

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
- https://www.npmjs.com/package/leaflet-image (OUTDATED?)
- https://docs.mapbox.com/api/maps/static-images/
- [Plotting Strava data with Python](https://nddoornekamp.medium.com/plotting-strava-data-with-python-7aaf0cf0a9c3)

## Existing alternatives
 - https://moqop.com/about (can't add custom picture, no date etc.)
 - https://www.cartorion.com/ (good one, but aimed for printing)
 - https://www.heatflask.com/ (motion)
 - https://www.workoutsnap.com/ (iOS only)
 - https://marcbaldwin.github.io/velographic/ (iOS only)
 - https://stravify.com/ (a lot of stats)
 - https://statshunters.com/ (advanced tool: heatmap, art, stats etc.)
 - https://alfanla.com/stralizer/ (nice set of templates !!!)
