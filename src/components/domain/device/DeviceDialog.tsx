'use client';

import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/framework/layout';
import { AccordionComponents } from "@/components/framework";
import { Button, FormField, FormGroup, FormSection, Input, Label, Select, SelectItem } from '@/components/framework/form';
import { X, Save, Trash2 } from 'lucide-react';

type Device = {
  id: string;
  line: string;
  serialNumber: string;
  ip: string;
  registDate: string;
  hardwareCount: number;
  serviceCount: number;
  model?: string;
  gpu?: string;
  hostname?: string;
};

interface DeviceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  onSave: (device: Device) => void;
  onDelete: (deviceId: string) => void;
}

export default function DeviceDialog({ isOpen, onClose, device, onSave, onDelete }: DeviceDialogProps) {

  const [formData, setFormData] = useState<Device>({
    id: '',
    line: '',
    serialNumber: '',
    ip: '',
    registDate: '',
    hardwareCount: 0,
    serviceCount: 0,
    model: '',
    gpu: '',
    hostname: '',
  });

  React.useEffect(() => {
    if (device) {
      setFormData({
        ...device,
        model: device.model || 'NVIDIA Jetson AGX Orin Developer Kit',
        gpu: device.gpu || 'Ampere GPU with 2048 CUDA cores',
        hostname: device.hostname || 'Ubuntu',
      });
    }
  }, [device]);


  const handleSave = () => {
    if (!device) return;
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (!device) return;
    onDelete(device.id);
    onClose();
  };

  const handleInputChange = (field: keyof Device, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!device) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-full w-[500px] ml-auto">
        {/* Header */}
        <DrawerHeader className="flex-row items-center justify-between border-b">
          <DrawerTitle className="text-lg">디바이스 수정</DrawerTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DrawerHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6">
          <AccordionComponents.Root type="multiple" defaultValue={["basicInfo"]}>
            <AccordionComponents.Item value="basicInfo">
              <AccordionComponents.Trigger>
                기본 정보
              </AccordionComponents.Trigger>
              <AccordionComponents.Content className="pb-4">
                <FormSection className="pt-4">
                  <FormField>
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    />
                  </FormField>
                   
                  <FormField>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={formData.model || ''}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                    />
                  </FormField>
                   
                  <FormField>
                    <Label htmlFor="gpu">GPU</Label>
                    <Input
                      id="gpu"
                      value={formData.gpu || ''}
                      onChange={(e) => handleInputChange('gpu', e.target.value)}
                    />
                  </FormField>
                   
                  <FormField>
                    <Label htmlFor="hostname">Hostname</Label>
                    <Input
                      id="hostname"
                      value={formData.hostname || ''}
                      onChange={(e) => handleInputChange('hostname', e.target.value)}
                    />
                  </FormField>
                   
                  <FormGroup columns={2} className="pb-0">
                    <FormField>
                      <Label htmlFor="ip">IP</Label>
                      <Input
                         id="ip"
                         value={formData.ip}
                         onChange={(e) => handleInputChange('ip', e.target.value)}
                      />
                    </FormField>
                     
                    <FormField>
                      <Label htmlFor="line">Line</Label>
                      <Select
                        id="line"
                        value={formData.line}
                        onValueChange={(value) => handleInputChange('line', value)}
                        placeholder="라인을 선택하세요"
                      >
                        <SelectItem value="2CCL">2CCL</SelectItem>
                        <SelectItem value="5CCL">5CCL</SelectItem>
                        <SelectItem value="7CCL">7CCL</SelectItem>
                      </Select>
                    </FormField>
                  </FormGroup>
                </FormSection>
              </AccordionComponents.Content>
            </AccordionComponents.Item>

            <AccordionComponents.Item value="hardwareInfo">
              <AccordionComponents.Trigger>
                연결 하드웨어 정보
              </AccordionComponents.Trigger>
              <AccordionComponents.Content className="pb-4">
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">하드웨어 정보가 여기에 표시됩니다.</p>
                </div>
              </AccordionComponents.Content>
            </AccordionComponents.Item>

            <AccordionComponents.Item value="serviceInfo">
              <AccordionComponents.Trigger>
                서비스 정보
              </AccordionComponents.Trigger>
              <AccordionComponents.Content className="pb-4">
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">서비스 정보가 여기에 표시됩니다.</p>
                </div>
              </AccordionComponents.Content>
            </AccordionComponents.Item>
          </AccordionComponents.Root>
        </div>

        {/* Footer */}
        <DrawerFooter className="border-t">
          <div className="flex justify-end gap-2">
            <Button 
              onClick={handleSave}
              className="bg-gray-600 hover:bg-gray-700 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
               Delete
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
