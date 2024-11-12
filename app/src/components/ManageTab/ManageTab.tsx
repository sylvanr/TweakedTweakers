import React, { useEffect, useState } from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Items from '../../types/Items';
import Webshops from '../../types/Webshops';

interface ManageTabProps {
  variant: 'Items' | 'Webshops';
  elements: Items | Webshops;
}

const ManageTab: React.FC<ManageTabProps> = ({ variant, elements }) => {
  const api = 'http://localhost:5000';
  console.log("Connecting to api @ ", api);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editedElements, setEditedElements] = useState(elements);
  const [searchText, setSearchText] = useState<string>(''); // New state for search text

  // State for showing and handling the form for adding new items/webshops
  const [openAddForm, setOpenAddForm] = useState(false);
  const [newElementData, setNewElementData] = useState<any>({});

  // Toggle edit mode for a specific element
  const handleEditToggle = (key: string) => {
    setEditMode((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle changes to an element's fields in edit mode
  const handleFieldChange = (key: string, field: string, value: any) => {
    // Split the field name by dot notation to access nested fields
    const fieldParts = field.split('.');
    setEditedElements((prev: any) => {
      let updatedElement = { ...prev[key] };

      // If field has nested structure (e.g., 'selectors.price'), drill down into it
      if (fieldParts.length > 1) {
        let nestedObj = updatedElement;
        // Traverse to the correct nested object
        for (let i = 0; i < fieldParts.length - 1; i++) {
          nestedObj = nestedObj[fieldParts[i]];
        }
        nestedObj[fieldParts[fieldParts.length - 1]] = value;
      } else {
        updatedElement[field] = value;
      }

      return {
        ...prev,
        [key]: updatedElement,
      };
    });
  };

  // Submit an update
  const handleSubmit = async (key: string) => {
    const updateData = { item_name: key, new_item: { [key]: editedElements[key] }, operation: 'update', type: variant.toLowerCase() };

    try {

      const response = await fetch(api+'/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      const result = await response.json();
      if (result.success) {
        alert(result.success);
      } else {
        alert(result.error);
      }
      setEditMode((prev) => ({ ...prev, [key]: false }));
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  // Handle delete
  const handleDelete = async (key: string) => {
    if (!window.confirm(`Are you sure you want to delete ${key}?`)) {
      return;
    }
    const deleteData = { item_name: key, operation: 'delete', type: variant.toLowerCase() };

    try {
      const response = await fetch(api+'/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deleteData),
      });
      const result = await response.json();
      if (result.success) {
        alert(result.success);
        delete editedElements[key]; // Remove from local state after successful deletion
        setEditedElements({ ...editedElements });
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  // Filter elements based on search text
  const filteredElements = Object.keys(editedElements)
    .filter((key) => key.toLowerCase().includes(searchText.toLowerCase()))
    .reduce((acc, key) => {
      acc[key] = editedElements[key];
      return acc;
    }, {} as Items | Webshops);

  // Open the Add form
  const handleOpenAddForm = () => {
    const newElem = JSON.parse(JSON.stringify(Object.values(elements)[0]));
    newElem.name = '';
    newElem.main_category = '';
    newElem.subcategories = [];
    if (variant === 'Items') {
      newElem.base_price = 0;
      newElem.description = '';
      newElem.target_price = 0;
      newElem.target_discount_percentage = 0;
      newElem.brand = '';
      newElem.bought = false;
      newElem.search_term = '';
    } else {
      newElem.selectors = {
        product_container: '',
        url: '',
        title: '',
        price: '',
      };
      newElem.res = [];
      newElem.query_url = '';
      newElem.main_category = '';
      newElem.subcategories = [];
    }
    setNewElementData(newElem);
  };

  // useEffect to open the dialog once newElementData is updated
  useEffect(() => {
    // Open the form if newElementData has been populated with values
    if (Object.keys(newElementData).length > 0) {
      setOpenAddForm(true);
    }
  }, [newElementData]);

  const handleNewElementChange = (field: string, value: any) => {
    setNewElementData((prev: any) => {
      const fieldParts = field.split('.');
      let updatedData = { ...prev };

      if (fieldParts.length > 1) {
        let nestedObj = updatedData;
        for (let i = 0; i < fieldParts.length - 1; i++) {
          nestedObj[fieldParts[i]] = nestedObj[fieldParts[i]] || {};
          nestedObj = nestedObj[fieldParts[i]];
        }
        nestedObj[fieldParts[fieldParts.length - 1]] = value;
      } else {
        updatedData[field] = value;

        if (field === "base_price" || field === "target_discount_percentage") {
          updatedData['target_price'] = updatedData['base_price'] * (1 - updatedData['target_discount_percentage'] / 100);
        }

        if (field === "base_price" || field === "target_discount_percentage") {
          // convert field to float
          try {
            const floatVal = parseFloat(updatedData[field]);
            updatedData[field] = floatVal;
          } catch (error) {
            console.error('Error converting to float:', error);
          }
        }
      }

      return updatedData;
    });
  };


  // Handle form submission to create new item/webshop
  const handleAddSubmit = async () => {
    const addData = { item_name: newElementData.name, new_item: newElementData, operation: 'create', type: variant.toLowerCase() };

    try {
      const response = await fetch(api+'/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addData),
      });
      const result = await response.json();
      if (result.success) {
        alert(result.success);
        setOpenAddForm(false);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error adding:', error);
    }
  };

  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom>
        {variant}
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom>
        Manage the {variant} used in the scraping process.
      </Typography>

      {/* Search Field */}
      <TextField
        label="Search by Name"
        variant="outlined"
        size="small"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        fullWidth
        margin="normal"
      />

      {/* Add Button */}
      <Button variant="contained" color="primary" onClick={handleOpenAddForm} style={{ margin: '20px 0' }}>
        Add {variant.slice(0, -1)} {/* This will show "Add Item" or "Add Webshop" */}
      </Button>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Values</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(filteredElements).map((key) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>
                  {editMode[key] ? (
                    // Editable fields
                    <>
                      {Object.keys(editedElements[key]).map((field) => {
                        const fieldValue = (editedElements[key] as any)[field];
                        // Check if the value is an object and not an array
                        if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
                          return (
                            <div key={field}>
                              <Typography variant="body2">{field}:</Typography>
                              {Object.keys(fieldValue).map((subField) => (
                                <TextField
                                  key={subField}
                                  label={subField}
                                  value={(fieldValue as any)[subField]}
                                  onChange={(e) => handleFieldChange(key, `${field}.${subField}`, e.target.value)} // Use dot notation for nested fields
                                  variant="outlined"
                                  size="small"
                                  margin="dense"
                                  fullWidth
                                  style={{ marginLeft: '20px' }} // Indent nested fields for better readability
                                />
                              ))}
                            </div>
                          );
                        } else {
                          if (field !== 'res' && field !== 'target_price') {
                            return (
                              <TextField
                                key={field}
                                label={field}
                                value={fieldValue}
                                onChange={(e) => handleFieldChange(key, field, e.target.value)}
                                variant="outlined"
                                size="small"
                                margin="dense"
                                fullWidth
                              />
                            )
                          } else { (<div />) };
                        }
                      })}
                    </>
                  ) : (
                    // Display mode
                    <>
                      {Object.entries(editedElements[key]).map(([field, value]) => (
                        field !== 'res' ? (
                          typeof value === 'object' && !Array.isArray(value) ? (
                            <div key={field}>
                              <Typography variant="body2">{field}:</Typography>
                              {Object.entries(value).map(([subField, subValue]) => (
                                <Typography key={subField} variant="body2" style={{ marginLeft: '20px' }}>
                                  {subField}: {String(subValue)}
                                </Typography>
                              ))}
                            </div>
                          ) : (
                            <Typography key={field} variant="body2">
                              {field}: {String(value)}
                            </Typography>
                          )
                        ) : (
                          <div key={field} />
                        )
                      ))}

                    </>
                  )}
                </TableCell>
                <TableCell>
                  {editMode[key] ? (
                    <>
                      <Button variant="contained" color="primary" onClick={() => handleSubmit(key)}>
                        Submit
                      </Button>
                      <Button variant="text" onClick={() => handleEditToggle(key)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="contained" color="primary" onClick={() => handleEditToggle(key)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => handleDelete(key)}>
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add New Item/Webshop Dialog */}
      <Dialog open={openAddForm} onClose={() => setOpenAddForm(false)}>
        <DialogTitle>Add New {variant.slice(0, -1)}</DialogTitle>
        <DialogContent>
          {/* Render form fields dynamically based on the first element of 'elements' */}
          {Object.keys(Object.values(editedElements)[0] || {}).map((field) => {
            const fieldValue = newElementData[field];
            if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
              return (
                <div key={field}>
                  <Typography variant="body2">{field}:</Typography>
                  {Object.keys(fieldValue).map((subField) => (
                    <TextField
                      key={subField}
                      label={subField}
                      value={newElementData[field]?.[subField] || ''} // Use the nested value
                      onChange={(e) => handleNewElementChange(`${field}.${subField}`, e.target.value)}
                      variant="outlined"
                      size="small"
                      margin="dense"
                      fullWidth
                      style={{ marginLeft: '20px' }}
                    />
                  ))}
                </div>
              );
            } else {
              if (field !== "res" && field !== "target_price" && field !== "bought") {
                return (
                  <TextField
                    key={field}
                    label={field}
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={newElementData[field] || ''} // Use the direct field value
                    onChange={(e) => handleNewElementChange(field, e.target.value)}
                    margin="normal"
                  />
                )
              } else { (<div />) };
            }
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddForm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageTab;
