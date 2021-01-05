import React, { useEffect, useState } from "react";
import {Amplify, API, graphqlOperation } from "aws-amplify";
import { getSong } from "../graphql/queries";
import { updateSong } from "../graphql/mutations";


