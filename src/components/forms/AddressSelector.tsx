import React from 'react';

interface AddressData {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface AddressSelectorProps {
  prefix: string;
  data: AddressData;
  errors: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  prefix,
  data,
  errors,
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor={`${prefix}.street`} className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <input
          type="text"
          id={`${prefix}.street`}
          name={`${prefix}.street`}
          value={data.street || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter street address"
        />
        {errors[`${prefix}.street`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`${prefix}.street`]}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${prefix}.city`} className="block text-sm font-medium text-gray-700">
          City
        </label>
        <input
          type="text"
          id={`${prefix}.city`}
          name={`${prefix}.city`}
          value={data.city || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter city"
        />
        {errors[`${prefix}.city`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`${prefix}.city`]}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${prefix}.state`} className="block text-sm font-medium text-gray-700">
          State/Province
        </label>
        <input
          type="text"
          id={`${prefix}.state`}
          name={`${prefix}.state`}
          value={data.state || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter state/province"
        />
        {errors[`${prefix}.state`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`${prefix}.state`]}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${prefix}.country`} className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          id={`${prefix}.country`}
          name={`${prefix}.country`}
          value={data.country || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter country"
        />
        {errors[`${prefix}.country`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`${prefix}.country`]}</p>
        )}
      </div>
    </div>
  );
};

export default AddressSelector; 