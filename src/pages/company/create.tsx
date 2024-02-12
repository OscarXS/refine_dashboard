import React from 'react'
import { CompanyList } from './list'
import { Modal, Form, Input, Select } from 'antd'
import { useModal, useModalForm, useSelect } from '@refinedev/antd'
import { useGo } from '@refinedev/core'
import { CREATE_COMPANY_MUTATION } from '@/graphql/mutations'
import { USERS_SELECT_QUERY } from '@/graphql/queries'
import { SelectOptionWithAvatar } from '@/components'
import { GetFields, GetFieldsFromList } from '@refinedev/nestjs-query'
import { UsersSelectQuery } from '@/graphql/types'

export const Create = () => {
    const { selectProps, queryResult } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
        resource: 'users',
        optionLabel: 'name',
        meta: {
            gqlQuery: USERS_SELECT_QUERY
        }
    })

    const go = useGo()

    const goToListPage = () => {
        go({
            to: { resource: 'companies', action: 'list' },
            options: { keepQuery: true },
            type: 'replace'
        })
    }
    
    const { formProps, modalProps } = useModalForm({
        action: 'create',
        defaultVisible: true,
        resource: 'companies',
        redirect: false,
        mutationMode: 'pessimistic',
        onMutationSuccess: goToListPage,
        meta: {
            gqlMutation: CREATE_COMPANY_MUTATION
        }
    })

  return (
    <CompanyList>
        <Modal
            {...modalProps}
            mask={true}
            onCancel={goToListPage}
            title='Create Company'
            width={512}
        >
            <Form {...formProps}>
                <Form.Item 
                label='Company Name' 
                name='name' 
                rules={[{required: true}]}
                >
                    <Input placeholder="Please enter a company name" />
                </Form.Item>
                <Form.Item
                    label='Sales Owner'
                    name='salesOwnerId'
                    rules={[{required: true}]}
                >
                    <Select 
                        placeholder='Please select a sales owner'
                        {...selectProps}
                        options={
                            queryResult.data?.data.map((user) => ({
                                value: user.id,
                                label: (
                                    <SelectOptionWithAvatar  
                                        name={user.name}
                                        avatarUrl={user.avatarUrl ?? undefined}
                                    />
                                )
                            })) ?? []
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    </CompanyList>
  )
}