/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                primary: ["Poppins", "sans-serif;"],
            },
            colors: {
                primary: "#1DC071",
                secondary: "#0068ff",
                thirdly: "#3498DB",
                tertiary: "#B7DFFF",

                text1: "#171725",
                text2: "#4B5264",
                text3: "#808191",
                text4: "#B2B3BD",
                text5: "#171725",
                text6: "#eaedf0",
                text7: "#7589a3",
                iconColor: "#A2A2A8",
                white: "#FFFFFF",
                whiteSoft: "#FCFBFF",
                graySoft: "#FCFCFC",
                grayf3: "#f3f3f3",
                strock: "#F1F1F3",
                lite: "#FCFCFD",
                error: "#EB5757",
                darkBG: "#13131A",
                darkSecondary: "#1C1C24",
                softDark: "#22222C",
                darkSoft: "#24242C",
                darkStrock: "#3A3A43",
                darkRed: "#422C32",
            },
            boxShadow: {
                sdprimary: "10px 10px 20px rgba(211,211,211,0.25)",
            },
        },
    },
    plugins: [],
};
