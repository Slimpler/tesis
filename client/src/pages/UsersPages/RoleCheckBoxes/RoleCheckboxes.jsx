import React from 'react';

const RoleCheckboxes = ({ rolesOptions, formData, handleRolesChange }) => {
  return (
    <div>
      <label>Roles:</label>
      <div className="space-y-2">
        {rolesOptions.map((role) => (
          <label key={role._id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="roles"
              value={role._id}
              checked={formData.roles.includes(role._id)}
              onChange={handleRolesChange}
              className="form-checkbox text-blue-500 focus:ring-blue-500 h-4 w-4"
            />
            <span className="text-white">{role.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RoleCheckboxes;
