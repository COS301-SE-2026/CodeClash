import React from "react";
import { Link } from "react-router";
import { BookOpen, HelpCircle, GraduationCap, Info, } from "lucide-react";
import { HelpMenuViewModelFunction } from "../ViewModels/HelpMenuViewModel";

const HelpMenu: React.FC = () => {
    const {
        help, faqs, contact, openFAQ, toggleFAQ,
    } = HelpMenuViewModelFunction();

    const helpIcons = {
        book: BookOpen,
        help: HelpCircle,
        graduation: GraduationCap,
        info: Info,
    };

    return (

    );
};

export default HelpMenu;