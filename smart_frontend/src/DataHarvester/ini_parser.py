#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Mar  3 15:18:10 2021

@author: stellarremnants
"""

import configparser
import sys
import os

DEFAULT_INI_PATH = "gbo.ini"


REQUIRED_CONFIG_ITEMS = {
        "General" : ["Project Name", "Site Name"],
        "Calibration" : ["Mag1 Scale", "Mag2 Scale", "Mag3 Scale", "DAC1 Scale", "DAC2 Scale", "DAC3 Scale"],
        }

def parse_ini_file(ini_path=DEFAULT_INI_PATH, verbose=False):
    parsed_config_dict = {}
    valid_config = True
    if not os.path.exists(ini_path):
        return None, None, "ini_path does not exist"
    try:
        configs = configparser.ConfigParser()
        configs.read(ini_path)
        error_strings = []
        for section in REQUIRED_CONFIG_ITEMS.keys():
            if not (section in configs.sections()):
                error_string = f"ERROR: Missing section \"{section}\" of ini_file \"{ini_path}\""
                if verbose:
                    print(error_string)
                valid_config = False
                error_strings.append(error_string)
            for option in REQUIRED_CONFIG_ITEMS[section]:
                if not (option.lower() in configs.options(section)):
                    valid_config = False
                    error_string = f"ERROR: Missing option \"{option.lower()}\" in section \"{section}\" of ini_file \"{ini_path}\""
                    error_strings.append(error_string)
                    if verbose:
                        print(error_string)
        if valid_config:
            if verbose:
                print(f"STATUS: INI file {ini_path} is a valid config file")
            
            for section in REQUIRED_CONFIG_ITEMS.keys():
                if not (section) in parsed_config_dict.keys():
                    parsed_config_dict[section] = {}
                for option in REQUIRED_CONFIG_ITEMS[section]:
                    if section == "Calibration":
                        parsed_config_dict[section][option.lower()] = configs.getfloat(section, option.lower())
                    else:
                        parsed_config_dict[section][option.lower()] = configs.get(section, option.lower())
    except:
        e=sys.exc_info()
        return None, None, e
    else:
        dac_scale = [parsed_config_dict["Calibration"]["dac1 scale"],parsed_config_dict["Calibration"]["dac2 scale"],parsed_config_dict["Calibration"]["dac3 scale"]]
        mag_scale = [parsed_config_dict["Calibration"]["mag1 scale"],parsed_config_dict["Calibration"]["mag2 scale"],parsed_config_dict["Calibration"]["mag3 scale"]]
        if valid_config:
            return parsed_config_dict, dac_scale, mag_scale
        else:
            return None, None, error_strings