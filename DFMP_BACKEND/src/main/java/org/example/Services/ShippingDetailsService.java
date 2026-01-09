package org.example.Services;

import org.example.Models.ShippingDetails;
import org.example.Repositories.ShippingDetailsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShippingDetailsService {

    private final ShippingDetailsRepository shippingDetailsRepository;

    public ShippingDetailsService(ShippingDetailsRepository shippingDetailsRepository) {
        this.shippingDetailsRepository = shippingDetailsRepository;
    }


    public Optional<ShippingDetails> findById(Integer id){
        return shippingDetailsRepository.findById(id);
    }

    public List<ShippingDetails> findAll(){
        return shippingDetailsRepository.findAll();
    }

    public ShippingDetails add(ShippingDetails shippingDetails) {
        return shippingDetailsRepository.save(shippingDetails);
    }

    public ShippingDetails update(ShippingDetails shippingDetails) {
        Integer id = shippingDetails.getId();
        Optional<ShippingDetails> existingShippingDetailsOpt = shippingDetailsRepository.findById(id);
        ShippingDetails existingShippingDetails;
        if(existingShippingDetailsOpt.isPresent()){
            existingShippingDetails = existingShippingDetailsOpt.get();
            existingShippingDetails.setAddress(shippingDetails.getAddress());
            existingShippingDetails.setCity(shippingDetails.getCity());
            existingShippingDetails.setPhone_number(shippingDetails.getPhone_number());
            existingShippingDetails.setPostal_code(shippingDetails.getPostal_code());
            shippingDetailsRepository.save(existingShippingDetails);
        } else {
            return null;
        }
        return existingShippingDetails;
    }

    public boolean delete(Integer id){
        if (shippingDetailsRepository.existsById(id)){
            shippingDetailsRepository.deleteById(id);
        } else {
            return false;
        }
        return true;
    }

}
