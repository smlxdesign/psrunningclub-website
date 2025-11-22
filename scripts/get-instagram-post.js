#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { loadEnvFile, env } from "node:process";

loadEnvFile();

const API_URL = "https://graph.instagram.com/v24.0";

const data = await fetch(
    `${API_URL}/${env.ACCOUNT_ID}/media?fields=username,media_url,media_type,thumbnail_url`,
    {
        headers: {
            Authorization: `Bearer ${env.AUTHORIZATION_KEY}`,
        },
    },
).then((res) => {
    return res.json();
});

const latestPost = data.data
    .filter((post) => {
        return !!post.media_url;
    })
    .toSorted((a, b) => {
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
            ${
                latestPost.media_type === "VIDEO"
                    ? `<video controls width="350" poster="${latestPost.thumbnail_url}">
                <source src="${latestPost.media_url}">
              </video>`
                    : `<img width="350" src="${latestPost.media_url}" />`
            }
            <div>
                <p>
                    <a href="https://instagram.com/${latestPost.username}"
                        >@${latestPost.username}</a
                    >
                </p>
            </div>
        </instagram-post>
    `.trim(),
    ),
);
