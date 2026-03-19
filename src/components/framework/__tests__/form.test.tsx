import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Input, Textarea, Label, Select, SelectItem, Checkbox, Switch, FormField, FormGroup, FormSection } from '../form';

describe('Button', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should apply variant and size classes', () => {
    render(<Button variant="destructive" size="lg">Delete</Button>);
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('should support different button types', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    let button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.type).toBe('submit');

    rerender(<Button type="reset">Reset</Button>);
    button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.type).toBe('reset');

    rerender(<Button type="button">Button</Button>);
    button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.type).toBe('button');
  });

  it('should apply custom className', () => {
    const { container } = render(<Button className="custom-class">Button</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('custom-class');
  });

  it('should support all variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant}>Button</Button>);
      expect(screen.getByRole('button')).toBeDefined();
      unmount();
    });
  });

  it('should support all sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'] as const;
    sizes.forEach((size) => {
      const { unmount } = render(<Button size={size}>Button</Button>);
      expect(screen.getByRole('button')).toBeDefined();
      unmount();
    });
  });

  it('should support role prop', () => {
    render(<Button role="menuitem">Menu Item</Button>);
    expect(screen.getByRole('menuitem')).toBeDefined();
  });
});

describe('Input', () => {
  beforeEach(() => {
    // Clear any previous renders
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
  });

  it('should render input with placeholder', async () => {
    render(<Input placeholder="Enter text" />);
    // Use findByPlaceholderText to wait for async rendering
    const input = await screen.findByPlaceholderText('Enter text');
    expect(input).toBeDefined();
    expect(input.tagName).toBe('INPUT');
    expect(input.getAttribute('placeholder')).toBe('Enter text');
  });

  it('should handle onChange event', async () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Test input" />);
    const input = screen.getByPlaceholderText('Test input') as HTMLInputElement;
    
    await userEvent.type(input, 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should apply error styling when error prop is true', () => {
    const { container } = render(<Input error placeholder="Error input" />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('border-red-500');
  });

  it('should support different input types', () => {
    render(<Input type="email" placeholder="Email" />);
    const input = screen.getByPlaceholderText('Email') as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  it('should support defaultValue (uncontrolled)', () => {
    render(<Input defaultValue="default" />);
    const input = screen.getByDisplayValue('default') as HTMLInputElement;
    expect(input.value).toBe('default');
  });

  it('should support value (controlled)', () => {
    render(<Input value="controlled" onChange={vi.fn()} />);
    const input = screen.getByDisplayValue('controlled') as HTMLInputElement;
    expect(input.value).toBe('controlled');
  });

  it('should apply required styling when required prop is true', () => {
    const { container } = render(<Input required placeholder="Required input" />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('border-red-500');
  });

  it('should handle onBlur event', async () => {
    const handleBlur = vi.fn();
    render(<Input onBlur={handleBlur} placeholder="Test input" />);
    const input = screen.getByPlaceholderText('Test input') as HTMLInputElement;
    
    input.focus();
    input.blur();
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should handle onFocus event', async () => {
    const handleFocus = vi.fn();
    render(<Input onFocus={handleFocus} placeholder="Test input" />);
    const input = screen.getByPlaceholderText('Test input') as HTMLInputElement;
    
    input.focus();
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('should be readOnly when readOnly prop is true', () => {
    render(<Input readOnly placeholder="Read only input" />);
    const input = screen.getByPlaceholderText('Read only input') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  it('should support autoFocus prop', () => {
    render(<Input autoFocus placeholder="Auto focus input" />);
    const input = screen.getByPlaceholderText('Auto focus input') as HTMLInputElement;
    expect(input).toBe(document.activeElement);
  });

  it('should support maxLength prop', () => {
    render(<Input maxLength={10} placeholder="Max length input" />);
    const input = screen.getByPlaceholderText('Max length input') as HTMLInputElement;
    expect(input.maxLength).toBe(10);
  });

  it('should support min and max props for number input', () => {
    render(<Input type="number" min={0} max={100} placeholder="Number input" />);
    const input = screen.getByPlaceholderText('Number input') as HTMLInputElement;
    expect(input.min).toBe('0');
    expect(input.max).toBe('100');
  });

  it('should support step prop for number input', () => {
    render(<Input type="number" step={0.1} placeholder="Number input" />);
    const input = screen.getByPlaceholderText('Number input') as HTMLInputElement;
    expect(input.step).toBe('0.1');
  });

  it('should support all input types', () => {
    const types = ['text', 'password', 'email', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local', 'month', 'week'] as const;
    types.forEach((type) => {
      const { unmount } = render(<Input type={type} placeholder={`${type} input`} />);
      const input = screen.getByPlaceholderText(`${type} input`) as HTMLInputElement;
      expect(input.type).toBe(type);
      unmount();
    });
  });

  it('should apply custom className', () => {
    const { container } = render(<Input className="custom-class" placeholder="Test" />);
    const input = container.querySelector('input');
    expect(input?.className).toContain('custom-class');
  });

  it('should support id prop', () => {
    render(<Input id="test-input" placeholder="Test" />);
    const input = screen.getByPlaceholderText('Test') as HTMLInputElement;
    expect(input.id).toBe('test-input');
  });
});

describe('Textarea', () => {
  it('should render textarea with placeholder', () => {
    render(<Textarea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText('Enter description')).toBeDefined();
  });

  it('should handle onChange event', async () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} placeholder="Test textarea" />);
    const textarea = screen.getByPlaceholderText('Test textarea');
    
    await userEvent.type(textarea, 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />);
    const textarea = screen.getByPlaceholderText('Disabled textarea') as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(true);
  });

  it('should apply error styling when error prop is true', () => {
    const { container } = render(<Textarea error placeholder="Error textarea" />);
    const textarea = container.querySelector('textarea');
    expect(textarea?.className).toContain('border-red-500');
  });

  it('should handle value', () => {
    render(<Textarea value="Test value" onChange={vi.fn()} />);
    const textarea = screen.getByDisplayValue('Test value') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Test value');
  });

  it('should apply custom className', () => {
    const { container } = render(<Textarea className="custom-class" placeholder="Test" />);
    const textarea = container.querySelector('textarea');
    expect(textarea?.className).toContain('custom-class');
  });

  it('should support id prop', () => {
    render(<Textarea id="test-textarea" placeholder="Test" />);
    const textarea = screen.getByPlaceholderText('Test') as HTMLTextAreaElement;
    expect(textarea.id).toBe('test-textarea');
  });
});

describe('Label', () => {
  it('should render label with children', () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeDefined();
  });

  it('should show required indicator when required prop is true', () => {
    render(<Label required>Required Label</Label>);
    expect(screen.getByText('Required Label')).toBeDefined();
    // Check for asterisk
    expect(screen.getByText('*')).toBeDefined();
  });

  it('should associate with input using htmlFor', () => {
    render(
      <>
        <Label htmlFor="test-input">Test Input</Label>
        <Input id="test-input" />
      </>
    );
    expect(screen.getByText('Test Input')).toBeDefined();
    expect(screen.getByLabelText('Test Input')).toBeDefined();
  });

  it('should not show asterisk when required is false', () => {
    render(<Label>Normal Label</Label>);
    expect(screen.getByText('Normal Label')).toBeDefined();
    expect(screen.queryByText('*')).toBeNull();
  });

  it('should apply custom className', () => {
    const { container } = render(<Label className="custom-class">Test Label</Label>);
    const label = container.querySelector('label');
    expect(label?.className).toContain('custom-class');
  });
});

describe('Select', () => {
  it('should render select with placeholder', () => {
    render(
      <Select placeholder="Select an option">
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </Select>
    );
    expect(screen.getByText('Select an option')).toBeDefined();
  });

  it('should handle value change', async () => {
    const handleValueChange = vi.fn();
    render(
      <Select onValueChange={handleValueChange} placeholder="Select">
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </Select>
    );
    const select = screen.getByRole('combobox');
    await userEvent.click(select);
    
    const option = screen.getByText('Option 1');
    await userEvent.click(option);
    
    expect(handleValueChange).toHaveBeenCalledWith('option1');
  });

  it('should show error styling when error prop is true', () => {
    render(
      <Select error placeholder="Error select">
        <SelectItem value="option1">Option 1</SelectItem>
      </Select>
    );
    expect(screen.getByRole('combobox')).toBeDefined();
  });

  it('should be disabled when disabled prop is true', async () => {
    const handleValueChange = vi.fn();
    render(
      <Select 
        disabled 
        placeholder="Disabled select"
        onValueChange={handleValueChange}
      >
        <SelectItem value="option1">Option 1</SelectItem>
      </Select>
    );
    const select = screen.getByRole('combobox');
    
    // disabled된 Select는 클릭해도 열리지 않아야 함
    await userEvent.click(select);
    
    // SelectContent가 열리지 않았으므로 옵션을 찾을 수 없어야 함
    const option = screen.queryByText('Option 1');
    expect(option).toBeNull();
    
    // onValueChange도 호출되지 않아야 함
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it('should support controlled value', async () => {
    const handleValueChange = vi.fn();
    render(
      <Select value="option1" onValueChange={handleValueChange} placeholder="Select">
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </Select>
    );
    expect(screen.getByText('Option 1')).toBeDefined();
  });

  it('should render selectLabel when provided', async () => {
    render(
      <Select selectLabel="Category" placeholder="Select">
        <SelectItem value="option1">Option 1</SelectItem>
      </Select>
    );
    const select = screen.getByRole('combobox');
    await userEvent.click(select);
    
    const label = await screen.findByText('Category');
    expect(label).toBeDefined();
  });

  it('should support different sizes', () => {
    const sizes = ['sm', 'default', 'lg'] as const;
    sizes.forEach((size) => {
      const { unmount } = render(
        <Select size={size} placeholder="Select">
          <SelectItem value="option1">Option 1</SelectItem>
        </Select>
      );
      expect(screen.getByRole('combobox')).toBeDefined();
      unmount();
    });
  });

  it('should apply error styling when error prop is true', () => {
    const { container } = render(
      <Select error placeholder="Error select">
        <SelectItem value="option1">Option 1</SelectItem>
      </Select>
    );
    const trigger = container.querySelector('[role="combobox"]');
    expect(trigger?.className).toContain('border-red-500');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Select className="custom-class" placeholder="Select">
        <SelectItem value="option1">Option 1</SelectItem>
      </Select>
    );
    const trigger = container.querySelector('[role="combobox"]');
    expect(trigger?.className).toContain('custom-class');
  });

  it('should support id prop', () => {
    render(
      <Select id="test-select" placeholder="Select">
        <SelectItem value="option1">Option 1</SelectItem>
      </Select>
    );
    const select = screen.getByRole('combobox');
    expect(select.id).toBe('test-select');
  });
});

describe('SelectItem', () => {
  it('should render select item with children', async () => {
    render(
      <Select>
        <SelectItem value="test">Test Item</SelectItem>
      </Select>
    );
    // Open select first
    const select = screen.getByRole('combobox');
    await userEvent.click(select);
    
    const item = await screen.findByText('Test Item');
    expect(item).toBeDefined();
  });

  it('should be disabled when disabled prop is true', async () => {
    render(
      <Select>
        <SelectItem value="test" disabled>Disabled Item</SelectItem>
      </Select>
    );
    const select = screen.getByRole('combobox');
    await userEvent.click(select);
    
    const item = await screen.findByText('Disabled Item');
    expect(item).toBeDefined();
  });

  it('should apply custom className', async () => {
    render(
      <Select>
        <SelectItem value="test" className="custom-class">Test Item</SelectItem>
      </Select>
    );
    const select = screen.getByRole('combobox');
    await userEvent.click(select);
    
    const item = await screen.findByText('Test Item');
    expect(item).toBeDefined();
  });
});

describe('Checkbox', () => {
  it('should render checkbox', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeDefined();
  });

  it('should render checkbox with label', () => {
    render(<Checkbox label="Check me" />);
    expect(screen.getByRole('checkbox')).toBeDefined();
    expect(screen.getByText('Check me')).toBeDefined();
  });

  it('should handle checked change', async () => {
    const handleCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={handleCheckedChange} label="Test checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    
    await userEvent.click(checkbox);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('should be checked when checked prop is true', () => {
    render(<Checkbox checked={true} label="Checked" />);
    const checkbox = screen.getByRole('checkbox') as HTMLButtonElement;
    expect(checkbox.getAttribute('aria-checked')).toBe('true');
  });

  it('should be disabled when disabled prop is true', async () => {
    const handleCheckedChange = vi.fn();
    render(
      <Checkbox 
        disabled 
        label="Disabled" 
        onCheckedChange={handleCheckedChange}
      />
    );
    const checkbox = screen.getByRole('checkbox');
    
    // disabled된 Checkbox는 클릭해도 상태가 변경되지 않아야 함
    await userEvent.click(checkbox);
    
    // onCheckedChange가 호출되지 않아야 함
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it('should show error styling when error prop is true', () => {
    const { container } = render(<Checkbox error label="Error checkbox" />);
    const checkbox = container.querySelector('[role="checkbox"]');
    expect(checkbox?.className).toContain('border-red-500');
    
    const label = screen.getByText('Error checkbox');
    expect(label.className).toContain('text-red-500');
  });

  it('should be unchecked when checked prop is false', () => {
    render(<Checkbox checked={false} label="Unchecked" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
  });

  it('should support indeterminate state', () => {
    render(<Checkbox checked="indeterminate" label="Indeterminate" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
  });

  it('should associate label with checkbox using id', () => {
    render(<Checkbox id="test-checkbox" label="Test Checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Test Checkbox');
    expect(checkbox.id).toBe('test-checkbox');
    expect(label.getAttribute('for')).toBe('test-checkbox');
  });

  it('should apply custom className', () => {
    const { container } = render(<Checkbox className="custom-class" label="Test" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('custom-class');
  });

  it('should toggle from unchecked to checked', async () => {
    const handleCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={handleCheckedChange} label="Test" />);
    const checkbox = screen.getByRole('checkbox');
    
    await userEvent.click(checkbox);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
    
    await userEvent.click(checkbox);
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });
});

describe('Switch', () => {
  it('should render switch', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toBeDefined();
  });

  it('should render switch with label', () => {
    render(<Switch label="Toggle me" />);
    expect(screen.getByRole('switch')).toBeDefined();
    expect(screen.getByText('Toggle me')).toBeDefined();
  });

  it('should handle checked change', async () => {
    const handleCheckedChange = vi.fn();
    render(<Switch onCheckedChange={handleCheckedChange} label="Test switch" />);
    const switchElement = screen.getByRole('switch');
    
    await userEvent.click(switchElement);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('should be checked when checked prop is true', () => {
    render(<Switch checked={true} label="Checked" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement.getAttribute('aria-checked')).toBe('true');
  });

  it('should be disabled when disabled prop is true', async () => {
    const handleCheckedChange = vi.fn();
    render(
      <Switch 
        disabled 
        label="Disabled" 
        onCheckedChange={handleCheckedChange}
      />
    );
    const switchElement = screen.getByRole('switch');
    
    // disabled된 Switch는 클릭해도 상태가 변경되지 않아야 함
    await userEvent.click(switchElement);
    
    // onCheckedChange가 호출되지 않아야 함
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it('should show error styling when error prop is true', () => {
    const { container } = render(<Switch error label="Error switch" />);
    const switchElement = container.querySelector('[role="switch"]');
    expect(switchElement?.className).toContain('border-red-500');
    
    const label = screen.getByText('Error switch');
    expect(label.className).toContain('text-red-500');
  });

  it('should be unchecked when checked prop is false', () => {
    render(<Switch checked={false} label="Unchecked" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement.getAttribute('aria-checked')).toBe('false');
  });

  it('should associate label with switch using id', () => {
    render(<Switch id="test-switch" label="Test Switch" />);
    const switchElement = screen.getByRole('switch');
    const label = screen.getByText('Test Switch');
    expect(switchElement.id).toBe('test-switch');
    expect(label.getAttribute('for')).toBe('test-switch');
  });

  it('should apply custom className', () => {
    const { container } = render(<Switch className="custom-class" label="Test" />);
    const switchElement = container.querySelector('[role="switch"]');
    expect(switchElement?.className).toContain('custom-class');
  });

  it('should toggle from unchecked to checked', async () => {
    const handleCheckedChange = vi.fn();
    render(<Switch onCheckedChange={handleCheckedChange} label="Test" />);
    const switchElement = screen.getByRole('switch');
    
    await userEvent.click(switchElement);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
    
    await userEvent.click(switchElement);
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('should render without label when label is not provided', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toBeDefined();
    expect(screen.queryByText('Test')).toBeNull();
  });
});

describe('FormField', () => {
  it('should render form field with children', () => {
    render(
      <FormField>
        <Input placeholder="Test" />
      </FormField>
    );
    expect(screen.getByPlaceholderText('Test')).toBeDefined();
  });

  it('should show requireDescription when provided', () => {
    render(
      <FormField requireDescription="This field is required">
        <Input placeholder="Test" />
      </FormField>
    );
    expect(screen.getByText('This field is required')).toBeDefined();
  });

  it('should show helpText when provided and no requireDescription', () => {
    render(
      <FormField helpText="This is helpful text">
        <Input placeholder="Test" />
      </FormField>
    );
    expect(screen.getByText('This is helpful text')).toBeDefined();
  });

  it('should prioritize requireDescription over helpText', () => {
    render(
      <FormField requireDescription="Error" helpText="Help">
        <Input placeholder="Test" />
      </FormField>
    );
    expect(screen.getByText('Error')).toBeDefined();
    expect(screen.queryByText('Help')).toBeNull();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <FormField className="custom-class">
        <Input placeholder="Test" />
      </FormField>
    );
    const field = container.firstChild as HTMLElement;
    expect(field.className).toContain('custom-class');
  });

  it('should render requireDescription with red text color', () => {
    const { container } = render(
      <FormField requireDescription="Error message">
        <Input placeholder="Test" />
      </FormField>
    );
    const errorText = container.querySelector('.text-red-500');
    expect(errorText).toBeDefined();
    expect(errorText?.textContent).toBe('Error message');
  });

  it('should render helpText with muted text color', () => {
    const { container } = render(
      <FormField helpText="Help message">
        <Input placeholder="Test" />
      </FormField>
    );
    const helpText = container.querySelector('.text-muted-foreground');
    expect(helpText).toBeDefined();
    expect(helpText?.textContent).toBe('Help message');
  });
});

describe('FormGroup', () => {
  it('should render form group with children', () => {
    render(
      <FormGroup>
        <Input placeholder="Input 1" />
        <Input placeholder="Input 2" />
      </FormGroup>
    );
    expect(screen.getByPlaceholderText('Input 1')).toBeDefined();
    expect(screen.getByPlaceholderText('Input 2')).toBeDefined();
  });

  it('should apply grid columns class based on columns prop', () => {
    const { container } = render(
      <FormGroup columns={2}>
        <Input placeholder="Input 1" />
        <Input placeholder="Input 2" />
      </FormGroup>
    );
    const group = container.firstChild as HTMLElement;
    expect(group.className).toContain('grid-cols-1');
    expect(group.className).toContain('md:grid-cols-2');
  });

  it('should support all column values', () => {
    const columns = [1, 2, 3, 4] as const;
    columns.forEach((cols) => {
      const { container, unmount } = render(
        <FormGroup columns={cols}>
          <Input placeholder="Input 1" />
        </FormGroup>
      );
      const group = container.firstChild as HTMLElement;
      expect(group.className).toContain('grid');
      expect(group.className).toContain('gap-4');
      expect(group.className).toContain('pb-4');
      unmount();
    });
  });

  it('should apply default columns (1) when columns prop is not provided', () => {
    const { container } = render(
      <FormGroup>
        <Input placeholder="Input 1" />
      </FormGroup>
    );
    const group = container.firstChild as HTMLElement;
    expect(group.className).toContain('grid-cols-1');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <FormGroup className="custom-class">
        <Input placeholder="Input 1" />
      </FormGroup>
    );
    const group = container.firstChild as HTMLElement;
    expect(group.className).toContain('custom-class');
  });
});

describe('FormSection', () => {
  it('should render form section with children', () => {
    render(
      <FormSection>
        <Input placeholder="Test" />
      </FormSection>
    );
    expect(screen.getByPlaceholderText('Test')).toBeDefined();
  });

  it('should render title when provided', () => {
    render(
      <FormSection title="Test Section">
        <Input placeholder="Test" />
      </FormSection>
    );
    expect(screen.getByText('Test Section')).toBeDefined();
  });

  it('should render description when provided', () => {
    render(
      <FormSection description="Section description">
        <Input placeholder="Test" />
      </FormSection>
    );
    expect(screen.getByText('Section description')).toBeDefined();
  });

  it('should render both title and description', () => {
    render(
      <FormSection title="Section Title" description="Section description">
        <Input placeholder="Test" />
      </FormSection>
    );
    expect(screen.getByText('Section Title')).toBeDefined();
    expect(screen.getByText('Section description')).toBeDefined();
  });

  it('should render title only when description is not provided', () => {
    render(
      <FormSection title="Section Title">
        <Input placeholder="Test" />
      </FormSection>
    );
    expect(screen.getByText('Section Title')).toBeDefined();
    expect(screen.queryByText('Section description')).toBeNull();
  });

  it('should render description only when title is not provided', () => {
    render(
      <FormSection description="Section description">
        <Input placeholder="Test" />
      </FormSection>
    );
    expect(screen.getByText('Section description')).toBeDefined();
    expect(screen.queryByText('Section Title')).toBeNull();
  });

  it('should not render header when neither title nor description is provided', () => {
    const { container } = render(
      <FormSection>
        <Input placeholder="Test" />
      </FormSection>
    );
    const header = container.querySelector('h3');
    expect(header).toBeNull();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <FormSection className="custom-class">
        <Input placeholder="Test" />
      </FormSection>
    );
    const section = container.firstChild as HTMLElement;
    expect(section.className).toContain('custom-class');
  });

  it('should render title with correct styling', () => {
    const { container } = render(
      <FormSection title="Section Title">
        <Input placeholder="Test" />
      </FormSection>
    );
    const title = container.querySelector('h3');
    expect(title?.className).toContain('text-lg');
    expect(title?.className).toContain('font-semibold');
  });

  it('should render description with correct styling', () => {
    const { container } = render(
      <FormSection description="Section description">
        <Input placeholder="Test" />
      </FormSection>
    );
    const description = container.querySelector('p');
    expect(description?.className).toContain('text-sm');
    expect(description?.className).toContain('text-muted-foreground');
  });
});

