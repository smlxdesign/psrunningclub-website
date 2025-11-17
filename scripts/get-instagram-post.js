#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";

process.loadEnvFile();

const API_URL = "https://graph.instagram.com/v24.0";

const data = await fetch(
  `${API_URL}/${process.env.ACCOUNT_ID}/media?fields=username,media_url`,
  {
    headers: {
      Authorization: `Bearer ${process.env.AUTHORIZATION_KEY}`,
    },
  },
).then((res) => {
  return res.json();
});

const latestPost = data.data.toSorted((a, b) => {
  return new Date(b.timestamp) - new Date(a.timestamp);
})[0];

const originialHtml = await readFile("../index.html", "utf-8");

const containerElementRegex = /(<instagram-post>)(.*)(<\/instagram-post>)/gs;

await writeFile(
  "../index.html",
  originialHtml.replace(
    containerElementRegex,
    `
      <instagram-post>
          <video controls width="350">
              <source src="${latestPost.media_url}">
          </video>
          <div>
              <p>
                  Postad av
                  <a href="https://instagram.com/${latestPost.username}"
                      >@$ { latestPost.username}</a
                  >
              </p>
          </div>
      </instagram-post>
  `.trim(),
  ),
);
