// Purpose: Contains the base form component that all forms will inherit from.
// All other forms will just pass props to this component. to be rendered.

import React, { useState } from "react";

export interface BaseFormProps {
	title: string;
	fields: Field[];
	submit: any; // function to call when form is submitted (optional)
	submitText: string;
	error: string;
}

interface Field {
	name: string;
	label: string;
	type: "select" | "file" | "text" | "textarea" | "password" | "email";
	// options : in case of select
	options?: string[];
	// placeholder : in case of input
	placeholder?: string;
}

export const BaseForm: React.FC<BaseFormProps> = ({
	title, // title of the form
	fields, // array of objects with name, label, type
	submit, // function to call when form is submitted
	submitText, // text to display on submit button
	error, // error message to display
}) => {
	const [form, setForm] = useState<{
		[key: string]: any;
	}>({});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value, type, files } = e.target as HTMLInputElement;

		if (type === "file" && files) {
			setForm({ ...form, [name]: files[0] });
		} else {
			setForm({ ...form, [name]: value });
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(form);

		submit(form);
	};

	return (
		<div className="base-form">
			<h1>{title}</h1>
			<form onSubmit={handleSubmit}>
				{fields.map((field: Field) => (
					<div key={field.name}>
						<label>{field.label}</label>
						{field.type === "select" ? (
							<select
								name={field.name}
								value={form[field.name] || ""}
								onChange={handleChange}
							>
								{/* First option */}
								<option value="">Select...</option>
								{field.options?.map((option: string) => (
									<option key={option.replace(" ", "-")} value={option}>
										{option}
									</option>
								))}
							</select>
						) : field.type === "textarea" ? (
							<textarea
								name={field.name}
								value={form[field.name] || ""}
								onChange={handleChange}
								placeholder={field.placeholder}
							/>
						) : field.type === "file" ? (
							<input type="file" name={field.name} onChange={handleChange} />
						) : (
							// text, password, email
							<input
								type={field.type}
								name={field.name}
								value={form[field.name] || ""}
								onChange={handleChange}
								placeholder={field.placeholder}
							/>
						)}
					</div>
				))}
				<button type="submit">{submitText}</button>
			</form>
			{error && <p>{error}</p>}
		</div>
	);
};
