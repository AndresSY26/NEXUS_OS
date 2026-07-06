export interface AsciiBanner {
  fontName: string;
  ascii: string;
  gradientClass: string;
  skewClass?: string;
}

export const asciiBanners: AsciiBanner[] = [
  {
    fontName: "Matrix Slant",
    ascii: `███    ██  ███████  ██   ██  ██    ██  ███████
████   ██  ██        ██ ██   ██    ██  ██     
██ ██  ██  █████      ███    ██    ██  ███████
██  ██ ██  ██        ██ ██   ██    ██       ██
██   ████  ███████  ██   ██   ██████   ███████`,
    gradientClass: "from-[#50a7ff] via-[#b56dfc] to-[#f45c83]",
    skewClass: "transform -skew-x-12"
  },
  {
    fontName: "Cyber Block",
    ascii: ` _   _  _____ __  __ _   _ ____   ___  ____  
| \\ | || ____|\\ \\/ /| | | / ___| / _ \\/ ___| 
|  \\| ||  _|   \\  / | | | \\___ \\| | | \\___ \\ 
| |\\  || |___  /  \\ | |_| |___) | |_| |___) |
|_| \\_||_____|/_/\\_\\ \\___/|____/ \\___/|____/ `,
    gradientClass: "from-[#00ff41] via-[#00ffff] to-[#38bdf8]"
  },
  {
    fontName: "Retro Isometric",
    ascii: ` ___  ___  _______  ___   ___  ___  ___  _______  ________ 
|"  \\/"  ||"     "| \\" \\ /"  |/"  ||"  |/"     "|/"       )
  \\   \\  /  (.  ___)  \\  V  /  |   | \\  |(.  ___/(   [----' 
   \\\\  \\/    |   \\     \\\\  //  |   |  | | |   \\   \\___ \\    
   /   /     (|  --_)  /  .  \\ |   \\_/  | (|  --_)____)  )  
  /   /      |:       \\/  /\\  \\ \\       / |:       \\    /   
 |___/       (________/__/  \\__\\ \\_____/  (________(____/   `,
    gradientClass: "from-[#ff007f] via-[#bd93f9] to-[#d800ff]"
  },
  {
    fontName: "Collegiate Bold",
    ascii: ` _   _  _____  __   __ _   _  ____     ___   ____  
| \\ | ||  ___| \\ \\ / /| | | |/ ___|   / _ \\ / ___| 
|  \\| || |_     \\ V / | | | |\\___ \\  | | | |\\___ \\ 
| |\\  ||  _|     > <  | |_| | ___) | | |_| | ___) |
|_| \\_||_____|  /_/\\_\\ \\___/|____/   \\___/|____/  `,
    gradientClass: "from-[#ffb000] via-[#ff5500] to-[#ff003c]"
  },
  {
    fontName: "Minimalist Code",
    ascii: `  _  _  ____ _  _ _  _  ___     ____  ___ 
  |\\ |  |___  \\/  |  |  [__     |  |  [__ 
  | \\|  |___ _/\\_ |__|  ___]    |__|  ___]`,
    gradientClass: "from-[#00ffff] via-[#50fa7b] to-[#00ff41]"
  },
  {
    fontName: "Rounded Bubble",
    ascii: ` _  _  ____  _  _  _  _  ___    ____  ___ 
( \\( )(  __)( \\/ )(  )( \\/ __)  (  _ \\/ __)
 )  (  ) _)  )  (  )(__)\\__ \\   )   /\\__ \\
(_)\\_)(____)(_/\\_)(____)(___/  (_)\\_)(___/`,
    gradientClass: "from-[#f45c83] via-[#ff007f] to-[#ff003c]"
  },
  {
    fontName: "Slanted Line",
    ascii: `    _   __                     ____  _____
   / | / /__  _  ____  _______/ __ \\/ ___/
  /  |/ / _ \\| |/_/ / / / ___/ / / /\\__ \\ 
 / /|  /  __/>  </ /_/ (__  ) /_/ /___/ / 
/_/ |_/\\___/_/|_|\\__,_/____/\\____//____/  `,
    gradientClass: "from-[#bd93f9] via-[#b56dfc] to-[#50a7ff]",
    skewClass: "transform skew-x-3"
  }
];
