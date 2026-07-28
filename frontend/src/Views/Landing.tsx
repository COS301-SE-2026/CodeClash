import React, {useState, useEffect} from "react";
import { Link } from "react-router";
import { LandingViewModelFunction } from "../ViewModels/LandingViewModel";
import { Rocket, Swords, Trophy, Calculator, Code2, ChartNoAxesColumn, Medal, History, Globe } from "lucide-react";
import symbolBackground from '../assets/Background/SymbolBackground.png';
import helloRobot from '../assets/Robots/HelloRobot_Pink.png';

const Landing:React.FC = ()=>{
    const {
        scrollY, stats, steps,
        features, audience, players,
    } = LandingViewModelFunction();

    const stepIcons = {
        rocket: Rocket,
        swords: Swords,
        trophy: Trophy,
    }

    const featureIcons = {
        calculator: Calculator,
        code: Code2,
        chart: ChartNoAxesColumn,
        medal: Medal,
        history: History,
        globe: Globe,
    }
}
export default Landing;