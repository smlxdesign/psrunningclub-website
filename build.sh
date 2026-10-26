#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"

touch $DIR/scripts/.env && printf "ACCOUNT_ID=${{ env.account_id }} \nAUTHORIZATION_KEY=${{ env.authorization_key }}\n" > $DIR/scripts/.env

cd $DIR/scripts
node ./get-instagram-post.js
