// This is the ViewModel for the brand style guide - this file will hold pieces of state and act as a hook between Model and View

import {useState, useCallback, useEffect} from "react";
import {brandStyleGuideContent} from "../Models/BrandStyleGuideModel";
import type { BrandStyleGuideContent } from "../Models/BrandStyleGuideModel";