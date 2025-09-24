import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const SelectorLanguaje = () => {
    const { i18n } = useTranslation();
const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
};
return (
<div className="flex mt-5 items-center space-x-2">
  <Globe className="h-4 w-4 text-white" />
  <Select value={i18n.language} onValueChange={handleLanguageChange}>
    <SelectTrigger className="w-[120px] bg-secondary/20 border-secondary/30 text-white">
      <SelectValue placeholder="Language" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="en">English</SelectItem>
      <SelectItem value="es">Español</SelectItem>
    </SelectContent>
  </Select>
</div>
)
}
export default SelectorLanguaje;