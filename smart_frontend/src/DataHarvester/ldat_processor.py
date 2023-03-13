#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created: 2021-06-18
Updated: 2021-06-18

This library contains improved functions for process L-type messages transmitted
by UCLA SMART GMAG fluxgate electronics boxes. These functions are intended to
perform more efficiently than those they replace and to establish a consistent
standard for the new generation of file formats.

The file format standards have been selected for:
    1) Universal compatibility (reduction in the need for specialized scripts)
    2) Ease of processing and use
    3) Processing time and resource efficiency
    4) Compressibility

@author: Joseph Lewis-Merrill
"""
# =============================================================================
# IMPORTS
# =============================================================================

import pandas
import numpy as np
import datetime
import os
import matplotlib.pyplot as plt
import math

from ini_parser import parse_ini_file

# =============================================================================
# GLOBAL CONSTANTS
# =============================================================================

BLOCK_COUNT_LENGTH = 10
BLOCK_COUNTS = [6,6,6,2,2,2,2,6,4,2]
BLOCK_INDICES = [1,7,13,19,21,23,25,27,33,37,39] #Indices of each block, off by one to ignore "L"
RESULT_NAMES = ["inCh3","inCh2","inCh1","inDac3","inDac2","inDac1",
                        "GPSFlg", "SOD", "MSec", "NSamp"]

UTC = datetime.timezone.utc

# HARRIS STATION CALIBRATION VALUES
DEFAULT_DAC_SCALE = np.asarray([
        472.7,
        482.3,
        485.7,
        ])

DEFAULT_MAG_SCALE = np.asarray([
        86.76,
        85.36,
        84.68,
        ])

TEST_MESSAGE = "L17BCBD171CEF1AA1F4167D554000FD23019A32"

# =============================================================================
# LMSG PARSING
# =============================================================================

def validate_lmsg(lmsg):
    if len(lmsg) != 39 or lmsg[0] != "L":
        return False
    else:
        return True

def interp_lmsg_base(lmsg):
    "Assumes prevalidation"
    data_array = np.zeros(BLOCK_COUNT_LENGTH, dtype=int)
    for i in range(BLOCK_COUNT_LENGTH):
        data_array[i] = int(lmsg[BLOCK_INDICES[i]:BLOCK_INDICES[i+1]], 16)
    return data_array

# =============================================================================
# FGLOG PARSING
# =============================================================================

def import_fglog_data(fglog_path):
    return pandas.read_csv(fglog_path)

def convert_fglog_data_to_numpy(fglog_dataframe):
    dataframe_columns = np.asarray(fglog_dataframe.columns)
    num_columns = len(dataframe_columns)
    time_indices = ["time" in dataframe_columns[i].lower() 
                    for i in range(num_columns)]
    if not np.sum(time_indices):
        raise ValueError("fglog missing time column")
    else:
        time_index = (np.arange(0,num_columns)[time_indices])[0]
    message_indices = ["message" in dataframe_columns[i].lower() 
                       for i in range(num_columns)]
    if not np.sum(message_indices):
        raise ValueError("fglog missing time column")
    else:
        message_index = (np.arange(0,num_columns)[message_indices])[0]
    time_array = np.asarray(fglog_dataframe[dataframe_columns[time_index]])
    message_array = np.asarray(fglog_dataframe[dataframe_columns[message_index]])
    return time_array, message_array

def parse_lmsg_data_from_numpy(time_array, message_array):
    lmsg_indices = [validate_lmsg(message_array[i]) for i in range(len(message_array))]
    lmsg_array = message_array[lmsg_indices]
    lmsg_count = len(lmsg_array)
    lmsg_timestamps = time_array[lmsg_indices]
    ldata_array = np.zeros([BLOCK_COUNT_LENGTH, lmsg_count], dtype=int)
    for i in range(lmsg_count):
        ldata_array[:,i] = interp_lmsg_base(lmsg_array[i])
        
    return lmsg_timestamps, ldata_array

def calculate_field_values(lmsg_timestamps, ldata_array, mag_scales, dac_scales):
    field_values = np.zeros([4, ldata_array.shape[1]], dtype=np.float64)
    field_values[0,:] = lmsg_timestamps
    nsamp_array = ldata_array[9]
    for i in range(3):
        inCh = ldata_array[2-i] # Channel values are reversed order (3,2,1)
        inDac = ldata_array[2-i+3] # Dac values are also reversed order (3,2,1)
        # Hardcoded calculation of field values from engineering units
        field_values[i+1,:] = (((inCh/3.125)*nsamp_array/50)-524288)/mag_scales[i] - (inDac-128)*dac_scales[i]
    return field_values

# =============================================================================
# LDAT GENERATION
# =============================================================================

def gen_ldat_string(field_values, station_code, mag_scales, dac_scales,
                    
                    timestamp_format_string = "%Y-%m-%d %H:%M:%S.%f UTC",
                    mag_scale_width = 10, mag_scale_precision=6,  
                    dac_scale_width = 10, dac_scale_precision=6,
                    timestamp_width = 18, timestamp_precision=7,
                    nT_width = 20, nT_precision=13,
                    ):
    
    #FORMATTING PARAMETERS
    mag_scale_format=f"0{mag_scale_width}.{mag_scale_precision}f"
    dac_scale_format=f"0{dac_scale_width}.{dac_scale_precision}f"
    timestamp_float_format_string = f"{timestamp_width}.{timestamp_precision}f"
    nT_format_string = f"{nT_width}.{nT_precision}f"
    
    # COLLECTION TIME PARAMS
    collection_start_float = field_values[0][0]
    collection_end_float = field_values[0][-1]
    collection_start = datetime.datetime.fromtimestamp(collection_start_float, tz=UTC)
    collection_start_string = collection_start.strftime(timestamp_format_string)
    collection_end = datetime.datetime.fromtimestamp(collection_end_float, tz=UTC)
    collection_end_string = collection_end.strftime(timestamp_format_string)
    
    # FILE CHARACTERISTICS
    num_lines = field_values.shape[1]
    
    # CALC PARAMETERS
    if len(mag_scales) != 3:
        raise ValueError(f"Specified mag_scales is invalid: must contain three entries (contains {len(mag_scales)}")
    if len(dac_scales) != 3:
        raise ValueError(f"Specified dac_scales is invalid: must contain three entries (contains {len(dac_scales)}")
        
    dac1,dac2,dac3 = dac_scales
    mag1,mag2,mag3 = mag_scales
    
    # HEADER GEN
    ldat_header = f"""UCLA SMART GMAG 
Low Speed Data (.ldat)
station_code,            {station_code}
collection_start,        {collection_start_string}
collection_end,          {collection_end_string}
collection_start_float,  {collection_start_float:{timestamp_float_format_string}}
collection_end_float,    {collection_end_float:{timestamp_float_format_string}}
lmsg_count,              {num_lines}
mag_scales,              {mag1:{mag_scale_format}},{mag2:{mag_scale_format}},{mag3:{mag_scale_format}}
dac_scales,              {dac1:{dac_scale_format}},{dac2:{dac_scale_format}},{dac3:{dac_scale_format}}

::BEGIN_DATA::
{'timestamp':>{timestamp_width}},{'nT1':>{nT_width}},{'nT2':>{nT_width}},{'nT3':>{nT_width}}
"""
    
    ldat_string = ldat_header
    for i in range(num_lines):
        timestamp, nT1, nT2, nT3 = field_values[:,i]
        ldat_string += f"{timestamp:{timestamp_float_format_string}},{nT1:{nT_format_string}},{nT2:{nT_format_string}},{nT3:{nT_format_string}}\n"
    
    return ldat_string

def safe_mkdir(path):
    try:
        os.mkdir(path)
    except FileExistsError:
        return True
    except PermissionError:
        return False
    else:
        return True
    
def sequential_safe_mkdir(dir_tree):
    path_seq = ""
    for directory in dir_tree:
        path_seq = os.path.join(path_seq, directory)
        success = safe_mkdir(path_seq)
        if not success:
            return False, path_seq
    return True, path_seq

def time_hierarchical_tree_mkdir(start_dir, tree_datetime, dir_levels=["%Y", "%m", "%d"]):
    dir_tree = [start_dir, *[tree_datetime.strftime(dir_marker) for dir_marker in dir_levels]]
    success, fail_path = sequential_safe_mkdir(dir_tree)
    return success, fail_path

def write_ldat(target_file_path, ldat_string, overwrite=False):
    if not os.path.exists(target_file_path) or overwrite:
        try:
            with open(target_file_path, "w") as outfile:
                outfile.write(ldat_string)
        except PermissionError:
            return False
        else:
            return True
    else:
        raise FileExistsError(f"File at path already exists (path='{target_file_path}')")

def gen_ldat_name(site_name, start_datetime, file_affix=".ldat"):
    
    if type(start_datetime) is float:
        start_datetime = datetime.datetime.fromtimestamp(start_datetime, tz=UTC)
    
    return (f"{site_name}_SMART_LDAT_"
            f"{start_datetime.year:04d}-{start_datetime.month:02d}-{start_datetime.day:02d}"
            f"_{start_datetime.hour:02d}{file_affix}")
# =============================================================================
# LDAT PARSING
# =============================================================================

def remove_padded_characters(padded_string, remove_leading_spaces = True, remove_trailing_spaces=True, pad_character=" "):
    temp_string = padded_string
    start_index = 0
    end_index = len(temp_string)
    if remove_leading_spaces:
        for i in range(len(temp_string)):
            if temp_string[i] == pad_character:
                continue
            else:
                start_index = i
                break
    if remove_trailing_spaces:
        for i in range(len(temp_string))[::-1]:
            if temp_string[i] == pad_character:
                continue
            else:
                end_index = i+1 # +1 for proper slicing
                break
                
    return temp_string[start_index:end_index]

def try_is_float(numstring):
    try:
        ret = float(numstring)
    except ValueError:
        return None
    else:
        return ret
def read_ldat_header(target_file_path):
    header_values = {}
    inline = ""
    line_counter = 0
    with open(target_file_path, "r") as fdin:
        while inline != "::BEGIN_DATA::":
            inline = "".join(fdin.readline().split("\n"))        
            if "," in inline:
                value_name, value_string = inline.split(",", 1)
                value_string = remove_padded_characters(value_string)
                if "," in value_string:
                    values = value_string.split(",")
                else:
                    values = [value_string]
                    
                for i in range(len(values)):
                    value = values[i]
                    ret = try_is_float(value)
                    if not (ret is None):
                        values[i] = ret
                header_values[value_name] = values
            line_counter += 1
    return header_values, line_counter

def read_ldat(target_file_path):
    if not os.path.exists(target_file_path):
        raise Exception(f"Specified file path does not exist (path='{target_file_path}')")
    else:
        header_values, line_counter = read_ldat_header(target_file_path)
        indataframe = pandas.read_csv(target_file_path, skiprows=line_counter)
        return header_values, indataframe
    

    
# =============================================================================
# BATCH PROCESSING
# =============================================================================

def find_all_matching_files(start_dirs, file_affix=".fglog", case_sensitive=False):
    if not (type(start_dirs) is list):
        start_dirs = [start_dirs]
    matching_path_list = []
    file_affix_length = len(file_affix)
    if not case_sensitive:
        file_affix_lower = file_affix.lower()
        
        for start_dir in start_dirs:
            for dir_path, subdirs, file_list in os.walk(start_dir):
                for file_name in file_list:
                    if file_name.lower()[-file_affix_length:] == file_affix_lower:
                        matching_path_list.append([dir_path, file_name])
    else:
        for start_dir in start_dirs:
            for dir_path, subdirs, file_list in os.walk(start_dir):
                for file_name in file_list:
                    if file_name[-file_affix_length:] == file_affix:
                        matching_path_list.append([dir_path, file_name])
    return sorted(matching_path_list)

def batch_process_fglog_to_ldat(search_dirs = ".", save_dir = "ldat_data", 
                                search_file_affix=".fglog",
                                save_file_affix=".ldat",
                                case_sensitive=False,
                                overwrite=True,
                                ini_path="gbo.ini", 
                                verbose=True):
    parsed_config_dict, dac_scale, mag_scale = parse_ini_file(ini_path)
    
    if parsed_config_dict is None:
        raise KeyError(f"Specified ini file is not valid. (ini_path='{ini_path}', error(s)='{mag_scale}'")
        
    site_name = parsed_config_dict["General"]["site name"]
    
    search_file_path_list = find_all_matching_files(search_dirs, search_file_affix, case_sensitive)
    
    if verbose:
        file_counter = 0
        file_total = len(search_file_path_list)
        completion_ratio_tracker = -1
    
    
    for dir_path, file_name in search_file_path_list:
        
        file_path = os.path.join(dir_path, file_name)
        fglog_dataframe = import_fglog_data(file_path)
        time_array, message_array = convert_fglog_data_to_numpy(fglog_dataframe)
        lmsg_timestamps, ldata_array = parse_lmsg_data_from_numpy(time_array, message_array)
        field_values = calculate_field_values(lmsg_timestamps, ldata_array, mag_scale, dac_scale)
        
        
        if verbose:
            file_counter += 1
            completion_ratio = (file_counter/file_total)
            if completion_ratio >= completion_ratio_tracker + 0.001:
                print(f"\rProcessing fglog batch. File {file_counter}/{file_total} ({completion_ratio*100:4.1f}%) {file_name} {field_values.shape}    ", end="")
        if field_values.shape[1] == 0:
            continue
        ldat_string = gen_ldat_string(field_values, site_name, mag_scale, dac_scale)
        start_datetime = datetime.datetime.fromtimestamp(field_values[0][0], tz=UTC)
        dir_success, dir_path = time_hierarchical_tree_mkdir(save_dir, start_datetime)
        if not dir_success:
            raise Exception(f"Failed to create directory '{dir_path}'")
        ldat_file_name = gen_ldat_name(site_name, start_datetime, save_file_affix)
        ldat_file_path = os.path.join(dir_path, ldat_file_name)
        write_success = write_ldat(ldat_file_path, ldat_string, overwrite=overwrite)
        if not write_success:
            raise Exception(f"Failed to write file at {ldat_file_path}")
            
def load_ldat_batch(search_dirs = ".",
                    search_term="",
                    search_file_affix=".ldat",
                    case_sensitive=False,
                    verbose=True,
                    raise_error_on_length_mismatch=False):
    if verbose:
        print("Generating path list ... ", end="")
    search_file_path_list = find_all_matching_files(search_dirs, search_file_affix, case_sensitive)
    valid_file = np.ones([len(search_file_path_list)], dtype=bool)
    if verbose:
        print("Done")
    total_line_count = 0
    if verbose:
        print("Counting lines ... ", end="")
    for i in range(len(search_file_path_list)):
        dir_path, file_name = search_file_path_list[i]
        file_path = os.path.join(dir_path, file_name)
        header_values, _ = read_ldat_header(file_path)
        if not ("lmsg_count" in header_values.keys()):
            valid_file[i] = False
            continue
        else:
            total_line_count += int(header_values["lmsg_count"][0])
    if verbose:
        print("Done")
    
    data_array = np.zeros([total_line_count,4], dtype=float)
    line_index = 0
    for i in range(len(search_file_path_list)):
        if verbose:
            completion_ratio = line_index/total_line_count
            print(f"\rProcessing lines {line_index} / {total_line_count} ({completion_ratio*100:.1f}%)", end="")
        if valid_file[i]:
            dir_path, file_name = search_file_path_list[i]
            file_path = os.path.join(dir_path, file_name)
            header_values, indataframe = read_ldat(file_path)
            header_line_count = int(header_values["lmsg_count"][0])
            data_length = indataframe.shape[0]
            if header_line_count != data_length:
                if verbose:
                    print(f"\nWARNING! Mismatch between header line count {header_line_count} and data_shape {data_length} on file {file_name}!!")
                if raise_error_on_length_mismatch:
                    raise ValueError(f"WARNING! Mismatch between header line count {header_line_count} and data_shape {data_length} on file {file_name}!!")
            new_index = line_index+data_length
            if new_index > total_line_count:
                raise IndexError(f"Exceeded line count ({new_index} > {total_line_count}) while parsing file {file_name}")
            else:
                data_array[line_index:new_index, :] = indataframe
                line_index = new_index
    if verbose:
        final_ratio = line_index/total_line_count
        print(f"\rProcessed {line_index} out of {total_line_count} lines ({final_ratio*100:.1f}%)                                                           ")
    return data_array

def file_is_in_daterange(start_float, end_float, file_start_float, file_end_float):
    if (start_float >= file_start_float and start_float <= file_end_float): #Start float is in file
        return True
    elif (end_float >= file_start_float and end_float <= file_end_float): #End float is in file
        return True
    elif (start_float <= file_start_float) and (end_float >= file_end_float): #Start and end encompass file
        return True
    else:
        return False
    
"""
    if (start_float >= file_start_float and start_float <= file_end_float): #Start float is in file
        print("0", True)
    elif (end_float >= file_start_float and end_float <= file_end_float): #End float is in file
        print("1", True)
    elif (start_float <= file_start_float) and (end_float >= file_end_float): #Start and end encompass file
        print("2", True)
    else:
        print("3", False)
"""

def load_ldat_datetime_search(
        start_datetime,
        end_datetime=None,
        start_dir = ".",
        search_term="",
        search_file_affix=".ldat",
        case_sensitive=False,
        verbose=True,
        raise_error_on_length_mismatch=False):
    
    if end_datetime is None:
        end_datetime = datetime.datetime.now(tz=UTC)
    
    start_datetime_float = start_datetime.timestamp()
    end_datetime_float = end_datetime.timestamp()
    
    if verbose:
        print("Generating path list ... ", end="")
    search_file_path_list = find_all_matching_files([start_dir], search_file_affix, case_sensitive)
    valid_file = np.ones([len(search_file_path_list)], dtype=bool)
    if verbose:
        print("Done")
    total_line_count = 0
    if verbose:
        print("Counting lines ... ", end="")
    for i in range(len(search_file_path_list)):
        dir_path, file_name = search_file_path_list[i]
        file_path = os.path.join(dir_path, file_name)
        header_values, _ = read_ldat_header(file_path)
        header_value_keys = header_values.keys()
        if not ("lmsg_count" in header_value_keys):
            valid_file[i] = False
            continue
        
        elif not ("collection_start_float" in header_value_keys):
            valid_file[i] = False
            continue
        elif len(header_values["collection_start_float"]) == 0:
            valid_file[i] = False
            continue
        elif not(try_is_float(header_values["collection_start_float"][0])):
            valid_file[i] = False
            continue
                 
        elif not ("collection_end_float" in header_value_keys):
            valid_file[i] = False
            continue
        elif len(header_values["collection_end_float"]) == 0:
            valid_file[i] = False
            continue
        elif not(try_is_float(header_values["collection_end_float"][0])):
            valid_file[i] = False
            continue
        
        else:
            
            file_start_float = float(header_values["collection_start_float"][0])
            file_end_float = float(header_values["collection_end_float"][0])
            
            if not (file_is_in_daterange(start_datetime_float, end_datetime_float, file_start_float, file_end_float)):
                valid_file[i] = False
                continue
            else:
                total_line_count += int(header_values["lmsg_count"][0])
    if verbose:
        print("Done")
    
    data_array = np.zeros([total_line_count,4], dtype=float)
    line_index = 0
    for i in range(len(search_file_path_list)):
        if verbose:
            completion_ratio = line_index/total_line_count
            print(f"\rProcessing lines {line_index} / {total_line_count} ({completion_ratio*100:.1f}%)", end="")
        if valid_file[i]:
            dir_path, file_name = search_file_path_list[i]
            file_path = os.path.join(dir_path, file_name)
            header_values, indataframe = read_ldat(file_path)
            header_line_count = int(header_values["lmsg_count"][0])
            data_length = indataframe.shape[0]
            if header_line_count != data_length:
                if verbose:
                    print(f"\nWARNING! Mismatch between header line count {header_line_count} and data_shape {data_length} on file {file_name}!!")
                if raise_error_on_length_mismatch:
                    raise ValueError(f"WARNING! Mismatch between header line count {header_line_count} and data_shape {data_length} on file {file_name}!!")
            new_index = line_index+data_length
            if new_index > total_line_count:
                raise IndexError(f"Exceeded line count ({new_index} > {total_line_count}) while parsing file {file_name}")
            else:
                data_array[line_index:new_index, :] = indataframe
                line_index = new_index
    if verbose:
        final_ratio = line_index/total_line_count
        print(f"\rProcessed {line_index} out of {total_line_count} lines ({final_ratio*100:.1f}%)                                                           ")
    bool_array = (data_array[:,0] >= start_datetime_float) & (data_array[:,0] <= end_datetime_float)
    data_array = data_array[bool_array]
    return data_array[data_array[:,0].argsort()]

# =============================================================================
# DATA PROCESSING
# =============================================================================

def get_1D_datetime_array(float_time_array):
    array_len = len(float_time_array)
    datetime_array = np.zeros(array_len, dtype=datetime.datetime)
    for i in range(array_len):
        datetime_array[i] = datetime.datetime.fromtimestamp(float_time_array[i], tz=UTC)
    return datetime_array

def split_ldat_array(ldat_array):
    timestamps = ldat_array[:,0]
    nT_data = [ldat_array[:,1],ldat_array[:,2],ldat_array[:,3]]
    return timestamps, nT_data

def pad_1D_array(array, left_pad_count, right_pad_count, pad_val=0):
    new_len = len(array) + left_pad_count + right_pad_count
    padded_array = np.ones([new_len], dtype=array.dtype)*pad_val
    padded_array[left_pad_count:-right_pad_count] = array
    return padded_array

def window_average_1D_array(array, window_radius=5, pad_val=None, skip_self=False):

    array_len = len(array)
    padded_len = array_len+(2*window_radius)
    
    if pad_val is None:
        num_pad_val = 0
    padded_array = pad_1D_array(array, window_radius, window_radius, pad_val=num_pad_val)
    sum_array = np.zeros(array_len, dtype=array.dtype)
    average_counter = np.zeros(array_len, dtype=int)
    if pad_val is None:
        index_array = pad_1D_array(np.ones(array_len, dtype=int), window_radius, window_radius, pad_val=0)
    else:
        index_array = np.ones(padded_len, dtype=int)
    
    for i in range(window_radius*2 + 1):
        shift_val = i-(window_radius)
        if skip_self and shift_val == 0:
            continue
        left_index = i
        right_index = array_len+i
        sum_array += padded_array[left_index:right_index]
        average_counter += index_array[left_index:right_index]
    
    averaged_data = sum_array/average_counter
    
    return averaged_data

def identify_spikes_1D_array(array, window_radius=10, pad_val=None, cutoff=100):
    averaged_data = window_average_1D_array(array, window_radius, pad_val, skip_self=True)
    difference_data = abs(array - averaged_data)
    valid_points = difference_data<=cutoff
    return valid_points

def despike_data(timestamps, nT_data, datetimes):
    despiked_timestamps = []
    despiked_data = []
    despiked_datetimes = []
    for i in range(len(nT_data)):
        valid_points = identify_spikes_1D_array(nT_data[i])
        despiked_timestamps.append(timestamps[valid_points])
        despiked_data.append(nT_data[i][valid_points])
        despiked_datetimes.append(datetimes[valid_points])
    return despiked_timestamps, despiked_data, despiked_datetimes

def scale_1D_array_by_slice(array, scale_factor):
    return array[::scale_factor]

def scale_1D_array_by_mean(array, scale_factor):
    in_array_len = len(array)
    out_array_len = math.ceil(in_array_len/scale_factor)
    sum_array = np.zeros(out_array_len, dtype=array.dtype)
    count_array = np.zeros(out_array_len, dtype=int)
    index_array = np.ones(out_array_len, dtype=int)
    for i in range(scale_factor):
        step_slice = array[i::scale_factor]
        step_slice_len = len(step_slice)
        sum_array[:step_slice_len] += step_slice
        count_array[:step_slice_len] += index_array[:step_slice_len]
    return sum_array/count_array

def scale_despiked_data(despiked_timestamps, despiked_data, *args, scale_function = scale_1D_array_by_mean, **kwargs):
    scaled_timestamps = []
    scaled_data = []
    for i in range(len(despiked_timestamps)):
        scaled_timestamps.append(scale_function(despiked_timestamps[i], *args, **kwargs))
        scaled_data.append(scale_function(despiked_data[i], *args, **kwargs))
        
    return scaled_timestamps, scaled_data

def take_differences(array_set_1, array_set_2):
    if len(array_set_1) != len(array_set_2):
        raise ValueError("Input arrays of of unequal length")
    else:
        return_array_set = []
        array_set_len = len(array_set_1)
        for i in range(array_set_len):
            if array_set_1[i].shape != array_set_2[i].shape:
                raise ValueError(f"Subarrays have different shapes at index {i}: {array_set_1[i].shape} != {array_set_2[i].shape}")
            else:
                return_array_set.append(array_set_1[i] - array_set_2[i])
        return return_array_set

# =============================================================================
# PLOTTING LDAT
# =============================================================================

def plot_channels_simple(ldata_data_array):
    fig,axes=plt.subplots(nrows=3,ncols=1, sharex=True)
    timestamps = get_1D_datetime_array(ldata_data_array[:,0])
    for i in range(3):
        axes[i].plot(timestamps, ldata_data_array[:,i+1], color="blue")
        if i == 2:
            axes[i].set_xlabel("Date and Time [UTC]")
    
    fig.autofmt_xdate()
    return fig, axes


def plot_despiked_data_simple(despiked_timestamps, despiked_data, axis_letters=["X","Y","Z"],
                              marker=".", ms=5, ls="-", lw=1,
                              suptitle_header="SMART GMAG Data",
                              suptitle_date_format="%Y-%m-%d %H:%M:%S",
                              color="blue", fig_axes=None):
    if fig_axes is None:
        axis_count = len(despiked_timestamps)
        fig,axes=plt.subplots(nrows=axis_count,ncols=1, sharex=True)
        fig.set_size_inches(np.asarray([1920,1080])/fig.dpi) 
        
        if len(despiked_timestamps) == 0:
            return None,"No data in despiked_datetimes"
        elif len(despiked_timestamps[0]) == 0:
            return None,"No data in despiked_datetimes[0]"
        else:
            start_datetime = datetime.datetime.fromtimestamp(despiked_timestamps[0][0], tz=UTC).strftime(suptitle_date_format)
            end_datetime = datetime.datetime.fromtimestamp(despiked_timestamps[0][-1], tz=UTC).strftime(suptitle_date_format)
            suptitle = f"{suptitle_header}\n({start_datetime}) -> ({end_datetime})"
        fig.suptitle(suptitle)
        
        for i in range(axis_count):
            axes[i].set_ylabel(f"{axis_letters[i]}-Field [nT]")
        axes[-1].set_xlabel("Datetime UTC")
    else:
        fig, axes = fig_axes
        axis_count = len(axes)
    
    for i in range(axis_count):
        axes[i].plot(despiked_timestamps[i], despiked_data[i], color=color,
                     marker=marker, ms=ms, ls=ls, lw=lw)
    return fig,axes

def plot_despiked_data_datetimes(despiked_datetimes, despiked_data, axis_letters=["X","Y","Z"],
                                 marker=".", ms=5, ls="-", lw=1,
                                 suptitle_header="SMART GMAG Data",
                                 suptitle_date_format="%Y-%m-%d %H:%M:%S", color="blue"):
    axis_count = len(despiked_datetimes)
    fig,axes=plt.subplots(nrows=axis_count,ncols=1, sharex=True)
    fig.set_size_inches(np.asarray([1920,1080])/fig.dpi) 
    
    if len(despiked_datetimes) == 0:
        return None,"No data in despiked_datetimes"
    elif len(despiked_datetimes[0]) == 0:
        return None,"No data in despiked_datetimes[0]"
    else:
        start_datetime = despiked_datetimes[0][0].strftime(suptitle_date_format)
        end_datetime = despiked_datetimes[0][-1].strftime(suptitle_date_format)
        suptitle = f"{suptitle_header}\n({start_datetime}) -> ({end_datetime})"
    fig.suptitle(suptitle)
    for i in range(axis_count):
        axes[i].plot(despiked_datetimes[i], despiked_data[i], color=color,
                     marker=marker, ms=ms, ls=ls, lw=lw)
        axes[i].set_ylabel(f"{axis_letters[i]}-Field [nT]")
    axes[-1].set_xlabel("Datetime UTC")
    fig.autofmt_xdate()
    return fig,axes
    datetime.datetime(2021,5,11,tzinfo=UTC)
# %%
if __name__ == "__main__":
    print("Starting data load in ... ")
    start_datetime = datetime.datetime(2021,4,1,tzinfo=UTC)
    end_datetime = datetime.datetime(2021,7,13,tzinfo=UTC)
    data_array = load_ldat_datetime_search(start_datetime, end_datetime)
    
    print("Splitting arrays ...")
    timestamps, nT_data = split_ldat_array(data_array)
    
    print("Getting datetimes ...")
    datetimes = get_1D_datetime_array(timestamps)
    
    print("Despiking arrays ...")
    despiked_timestamps, despiked_data, despiked_datetimes = despike_data(timestamps, nT_data, datetimes)
    
    print("Creating wide window-average array ...")
    wide_data = [window_average_1D_array(despiked_data[i], window_radius=100, skip_self=False) for i in range(3)]
    
    print("Rescaling arrays ...")
    scaled_timestamps, scaled_data = scale_despiked_data(despiked_timestamps, despiked_data, scale_factor=10)
    scaled_wide_timestamps, scaled_wide_data = scale_despiked_data(despiked_timestamps, wide_data, scale_factor=10)
    
    print("Taking differences ...")
    difference_data = take_differences(despiked_data, wide_data)
    
    print("Scaling differences ...")
    scaled_diff_timestamps, scaled_diff_data = scale_despiked_data(despiked_timestamps, difference_data, scale_factor=10)
    
    # sliced_timestamps, sliced_data = scale_despiked_data(despiked_timestamps, despiked_data, scale_function=scale_1D_array_by_slice, scale_factor=10)
#%%
if __name__ == "__main__":
    print("Plotting arrays ... ")
    fig_axes = plot_despiked_data_simple(scaled_timestamps, scaled_data, marker="", color="blue")
    plot_despiked_data_simple(scaled_wide_timestamps, scaled_wide_data, marker="", color="orange", fig_axes=fig_axes)
    
    fig,axes = fig_axes
    twin_axes = [ax.twinx() for ax in axes]
    for i in range(len(axes)):
        twin_axes[i].plot(scaled_diff_timestamps[i], scaled_diff_data[i], color="green", lw=1)
    
    # plot_despiked_data_simple(scaled_timestamps, scaled_data, marker="", color="orange", fig_axes=(fig, axes))
    # plot_despiked_data_simple(sliced_timestamps, sliced_data, marker="", color="green", fig_axes=(fig, axes))
    print("Done")
# # %%
# if __name__ == "__main__":
#     plot_channels_simple(data_array)

# %%


# import sounddevice as sd
# from scipy.io import wavfile

# if __name__ == "__main__":
#     norm_difference = [diff/np.max(abs(diff)) for diff in difference_data]
#     cent_difference = [norm-np.mean(norm) for norm in norm_difference]
    
#     counter = 0
#     for cent in cent_difference:
#         wavfile.write(f"testfile_{counter:02d}.wav", 44100, cent)
#         counter += 1
    # sd.play(cent_difference[0], samplerate = 44100)

# array = nT_data[0]
# averaged_data = window_average_1D_array(array, 5)

# valid_points = identify_spikes_1D_array(array)
# despiked_array = array[valid_points]
# despiked_times = timestamps[valid_points]
#%%
# if __name__ == "__main__":
    
#     start = datetime.datetime(2021, 5, 12, 15, tzinfo=UTC); start_float = start.timestamp()
#     end = datetime.datetime(2021, 5, 12, 15, 30, tzinfo=UTC); end_float = end.timestamp()
    
#     load_data = load_ldat_datetime_search(start, end)
    
#     start_bool = load_data[:,0] >= start_float
#     end_bool = load_data[:,0] <= end_float

#     bool_array = start_bool & end_bool
    
#     sliced_load_data = load_data[bool_array]