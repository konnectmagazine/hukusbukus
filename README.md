# Hukus Bukus

A complete, responsive website for the Hukus Bukus YouTube channel, created for curious children in Kashmir. The site combines videos, educational opportunities in India, creative activities, and local discovery in a warm, illustrated design.

## Features

- A searchable library of 93 entries collected from the two supplied public YouTube playlists on 22 November 2026, with original titles and real YouTube thumbnails.
- Playlist filters, progressive loading, and an accessible same-page video dialog.
- An “Add video here” space accepting YouTube watch, Shorts, live, embed, and youtu.be links. Playback is temporary for the current visit; it does not publish or save submitted links.
- Light and dark themes, with the display preference saved only in the visitor’s browser.
- Links to DIKSHA, the National Scholarship Portal, and myScheme, with guidance for families to verify eligibility and current details.
- Rotating creative missions and illustrated Harwan, Burzahom, Shalimar, and Ganderbal discovery cards with map links.
- Links to the channel, both playlists, and Konnect Magazine.

## Technologies and local use

The project uses semantic HTML, plain CSS, and browser JavaScript modules. No framework, installation, compilation, database, or API credentials are needed. Netlify Image CDN optimizes the hero image and YouTube thumbnails. Google Fonts supplies Fredoka and DM Sans.

From the project directory, run `netlify dev --port 8889` and open `http://localhost:8889`. Netlify serves the repository root as configured in `netlify.toml`; there is no build command.

## Content maintenance

Edit `assets/videos.js` to update the video catalog. Each entry contains the original title, video ID, playlist ID, and one of the two category names used in `app.js`. The catalog is a collected snapshot, rather than a live YouTube synchronization. Only public entries exposed by the playlist pages at collection time are included.

Edit `app.js` for creative prompts, village descriptions, and map destinations. Edit `index.html` for learning resources and other copy. Theme tokens and responsive layout rules are in `styles.css`.

The hero is a generated storybook illustration. Local discovery cards use original decorative SVG illustrations, not photographs of the places. YouTube supplies all video thumbnails and controls playback; individual videos can be restricted or have embedding disabled. The player always includes an external YouTube fallback link. Videos and links require internet access. No personal information is requested or stored by the site.

## Verification

Files, links, content structure, and interaction code were reviewed directly. Build and browser validation are handled by the deployment pipeline.
