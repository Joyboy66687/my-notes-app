function useTheme() {
  const [theme, setTheme] = useState(()=>localStorage.getItem("theme")||"light");
  useEffect(()=> {
    document.documentElement.classList.add("transition-colors","duration-700");
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme==="dark");
  }, [theme]);
  return { theme, setTheme, isDark: theme==="dark" };
}
