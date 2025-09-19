import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import type { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRecoilState } from "recoil";
import { languageAtom } from "@/context";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "#121212",
    color: "#f1f1f1",
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow:
      "0 0 0 0 rgba(255,255,255,0), 0 0 0 1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: "#ccc",
        marginRight: theme.spacing(1.5),
      },
      "&:hover": {
        backgroundColor: "#1e1e1e",
      },
    },
  },
}));

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [language, setLanguage] = useRecoilState(languageAtom);
  const open = Boolean(anchorEl);

  // all available languages
  const allLanguages = ["javascript","python"];

  // filter out currently selected language
  const menuLanguages = allLanguages.filter((lang) => lang !== language);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (selectedLang?: string) => {
    setAnchorEl(null);
    if (selectedLang) setLanguage(selectedLang);
  };

  return (
    <div>
      <Button
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          backgroundColor: "#27272A",
          color: "#f1f1f1",
          "&:hover": {
            backgroundColor: "#1e1e1e",
          },
          marginTop: "5px",
          marginBottom: "3px",
        }}
      >
        {language}
      </Button>

      <StyledMenu
        id="demo-customized-menu"
        slotProps={{
          list: {
            "aria-labelledby": "demo-customized-button",
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
      >
        {menuLanguages.map((lang) => (
          <MenuItem key={lang} onClick={() => handleClose(lang)} disableRipple>
            <EditIcon />
            {lang}
          </MenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
