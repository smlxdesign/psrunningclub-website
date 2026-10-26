#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"

printf "ACCOUNT_ID=$ACCOUNT_ID \nAUTHORIZATION_KEY=$AUTHORIZATION_KEY \n" > $DIR/scripts/.env

cd $DIR/scripts
node ./get-instagram-post.js
